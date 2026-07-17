import { useEffect, useMemo, useRef, useState } from 'react';
import { ThemeProvider } from './context/ThemeContext.jsx';
import { fetchMenu } from './api/menuApi.js';
import { AppShell } from './components/layout/AppShell.jsx';
import { ArViewer } from './pages/ArViewer.jsx';
import { CartPage } from './pages/CartPage.jsx';
import { CheckoutPage } from './pages/CheckoutPage.jsx';
import { ItemDetailPage } from './pages/ItemDetailPage.jsx';
import { MenuPage } from './pages/MenuPage.jsx';
import { NoInternetPage } from './pages/NoInternetPage.jsx';
import { PlacedPage } from './pages/PlacedPage.jsx';
import { SearchPage } from './pages/SearchPage.jsx';
import { ServiceRequestPage } from './pages/ServiceRequestPage.jsx';
import { TrackingPage } from './pages/TrackingPage.jsx';
import { WelcomePage } from './pages/WelcomePage.jsx';
import {
  categories,
  etaByStep,
  itemDetails,
  menuItems,
  money,
  orderSteps,
  requestLabels,
  requestTiles,
} from './data/menu.js';

const venueName = 'EMBER';
const tableLabel = 'Table 12';

function defaultMods(item) {
  const mods = {};
  (item?.modifiers || []).forEach((group) => {
    mods[group.id] = group.type === 'multi' ? [] : group.options[0].id;
  });
  return mods;
}

function AppContent() {
  const [apiMenuItems, setApiMenuItems] = useState([]);
  const [apiItemDetails, setApiItemDetails] = useState({});
  const [menuApiFailed, setMenuApiFailed] = useState(false);
  const [screen, setScreen] = useState('welcome');
  const [cat, setCat] = useState('all');
  const [search, setSearch] = useState('');
  const [cart, setCart] = useState([]);
  const [selectedId, setSelectedId] = useState(null);
  const [qty, setQty] = useState(1);
  const [variant, setVariant] = useState('');
  const [mods, setMods] = useState({});
  const [showAR, setShowAR] = useState(false);
  const [orders, setOrders] = useState([]);
  const [confirm, setConfirm] = useState(false);
  const [editingKey, setEditingKey] = useState(null);
  const [draftNote, setDraftNote] = useState('');
  const [reqType, setReqType] = useState('WATER');
  const [reqNote, setReqNote] = useState('');
  const [requests, setRequests] = useState([]);
  const [toast, setToast] = useState(null);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [menuChromeCompact, setMenuChromeCompact] = useState(false);
  const [isOnline, setIsOnline] = useState(() => typeof navigator === 'undefined' || navigator.onLine);
  const toastTimer = useRef(null);
  const requestCounter = useRef(0);
  const menuInteractionLocked = useRef(false);

  const menu = useMemo(() => (apiMenuItems.length ? apiMenuItems : menuItems), [apiMenuItems]);
  const details = useMemo(
    () => (apiMenuItems.length ? apiItemDetails : itemDetails),
    [apiItemDetails, apiMenuItems.length],
  );

  useEffect(() => {
    const timer = setInterval(() => {
      setOrders((current) => current.map((order) => (order.step < 4 ? { ...order, step: order.step + 1 } : order)));
    }, 5200);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    const updateOnlineStatus = () => setIsOnline(navigator.onLine);
    updateOnlineStatus();
    window.addEventListener('online', updateOnlineStatus);
    window.addEventListener('offline', updateOnlineStatus);
    return () => {
      window.removeEventListener('online', updateOnlineStatus);
      window.removeEventListener('offline', updateOnlineStatus);
    };
  }, []);

  useEffect(() => {
    const controller = new AbortController();
    fetchMenu({ limit: 20, signal: controller.signal })
      .then((next) => {
        if (menuInteractionLocked.current) return;
        setApiMenuItems(next.menuItems);
        setApiItemDetails(next.itemDetails);
        setMenuApiFailed(false);
      })
      .catch((error) => {
        if (error.name !== 'AbortError') {
          setMenuApiFailed(true);
          console.warn(error);
        }
      });
    return () => controller.abort();
  }, []);

  function flash(text) {
    window.clearTimeout(toastTimer.current);
    setToast(text);
    toastTimer.current = window.setTimeout(() => setToast(null), 2000);
  }

  function go(nextScreen) {
    if (nextScreen !== 'menu') setMenuChromeCompact(false);
    setScreen(nextScreen);
    setConfirm(false);
    setShowAR(false);
  }

  function openSearch() {
    setMenuChromeCompact(false);
    setScreen('search');
  }

  function retryConnection() {
    const online = navigator.onLine;
    setIsOnline(online);
    if (!online) flash('Still offline');
  }

  function openItem(id) {
    menuInteractionLocked.current = true;
    const item = menu.find((entry) => entry.id === id);
    if (!item) return;
    setSelectedId(id);
    setQty(1);
    setVariant(item.hasVariants ? item.variants[0].id : '');
    setMods(defaultMods(item));
    setScreen('item');
  }

  function qtyFor(id) {
    return cart.reduce((sum, line) => (line.id === id ? sum + line.qty : sum), 0);
  }

  function addSimple(id) {
    menuInteractionLocked.current = true;
    const item = menu.find((entry) => entry.id === id);
    if (!item) return;
    const key = `${id}|||`;
    setCart((current) => {
      const exists = current.some((line) => line.key === key);
      if (exists) return current.map((line) => (line.key === key ? { ...line, qty: line.qty + 1 } : line));
      return [
        ...current,
        {
          key,
          id,
          name: item.name,
          variantLabel: null,
          vid: '',
          modKey: '',
          modSummary: '',
          unit: item.price,
          qty: 1,
          notes: '',
          cat: item.cat,
          time: item.time,
        },
      ];
    });
  }

  function subSimple(id) {
    setCart((current) => {
      const indexFromEnd = [...current].reverse().findIndex((line) => line.id === id);
      if (indexFromEnd < 0) return current;
      const realIndex = current.length - 1 - indexFromEnd;
      const next = current.slice();
      if (next[realIndex].qty > 1) next[realIndex] = { ...next[realIndex], qty: next[realIndex].qty - 1 };
      else next.splice(realIndex, 1);
      return next;
    });
  }

  function incKey(key) {
    setCart((current) => current.map((line) => (line.key === key ? { ...line, qty: line.qty + 1 } : line)));
  }

  function decKey(key) {
    setCart((current) => {
      const next = current.slice();
      const index = next.findIndex((line) => line.key === key);
      if (index < 0) return current;
      if (next[index].qty > 1) next[index] = { ...next[index], qty: next[index].qty - 1 };
      else next.splice(index, 1);
      return next;
    });
  }

  function setLineNote(key, text) {
    const note = (text || '').trim();
    setCart((current) => {
      const next = current.slice();
      const index = next.findIndex((line) => line.key === key);
      if (index < 0) return current;
      const line = next[index];
      const newKey = `${line.id}|${line.vid || ''}|${line.modKey || ''}|${note}`;
      const duplicateIndex = next.findIndex((entry, idx) => idx !== index && entry.key === newKey);
      if (duplicateIndex >= 0) {
        next[duplicateIndex] = { ...next[duplicateIndex], qty: next[duplicateIndex].qty + line.qty };
        next.splice(index, 1);
      } else {
        next[index] = { ...line, notes: note, key: newKey };
      }
      return next;
    });
    setEditingKey(null);
    setDraftNote('');
  }

  function modOptions(item, selectedMods) {
    let delta = 0;
    const summary = [];
    (item.modifiers || []).forEach((group) => {
      if (group.type === 'multi') {
        (selectedMods[group.id] || []).forEach((optionId) => {
          const option = group.options.find((entry) => entry.id === optionId);
          if (option) {
            delta += option.price || 0;
            summary.push(option.label);
          }
        });
        return;
      }
      const option = group.options.find((entry) => entry.id === selectedMods[group.id]);
      if (option) {
        delta += option.price || 0;
        const isDefault = option.id === group.options[0].id;
        if (group.showDefault || !isDefault) summary.push(option.label);
      }
    });
    return { delta, summary };
  }

  function toggleMultiMod(groupId, optionId) {
    const current = mods[groupId] || [];
    setMods({
      ...mods,
      [groupId]: current.includes(optionId) ? current.filter((entry) => entry !== optionId) : [...current, optionId],
    });
  }

  function addToOrder() {
    const item = menu.find((entry) => entry.id === selectedId);
    if (!item) return;
    const selectedVariant = item.hasVariants ? item.variants.find((entry) => entry.id === variant) || item.variants[0] : null;
    const options = modOptions(item, mods);
    const unit = (selectedVariant ? selectedVariant.price : item.price) + options.delta;
    const vid = selectedVariant ? selectedVariant.id : '';
    const modKey = (item.modifiers || [])
      .map((group) => (group.type === 'multi' ? (mods[group.id] || []).slice().sort().join(',') : mods[group.id]))
      .join('~');
    const key = `${item.id}|${vid}|${modKey}|`;
    const amount = Math.max(1, qty);
    setCart((current) => {
      const exists = current.some((line) => line.key === key);
      if (exists) return current.map((line) => (line.key === key ? { ...line, qty: line.qty + amount } : line));
      return [
        ...current,
        {
          key,
          id: item.id,
          name: item.name,
          variantLabel: selectedVariant ? selectedVariant.label : null,
          vid,
          modKey,
          modSummary: options.summary.join(', '),
          unit,
          qty: amount,
          notes: '',
          cat: item.cat,
          time: item.time,
        },
      ];
    });
    setScreen('menu');
    flash(`${amount} x ${item.name} added`);
  }

  function sendOrder() {
    if (!cart.length) return;
    const total = cart.reduce((sum, line) => sum + line.unit * line.qty, 0);
    const order = {
      id: `o${Date.now()}`,
      number: `E${Math.floor(Math.random() * 900) + 100}`,
      time: new Date().toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' }),
      lines: cart.map((line) => ({ ...line })),
      total,
      count: cart.reduce((sum, line) => sum + line.qty, 0),
      step: 0,
    };
    setOrders((current) => [...current, order]);
    setCart([]);
    setScreen('placed');
    setConfirm(false);
  }

  function closeBill() {
    if (!confirm) {
      setConfirm(true);
      return;
    }
    setScreen('checkout');
    setConfirm(false);
  }

  function sendRequest() {
    const note = reqNote.trim();
    if (reqType === 'CUSTOM' && !note) {
      flash('Tell us what you need first');
      return;
    }
    requestCounter.current += 1;
    const id = `r${requestCounter.current}`;
    const row = {
      id,
      label: requestLabels[reqType],
      status: 'OPEN',
      note,
      time: new Date().toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' }),
    };
    setRequests((current) => [row, ...current]);
    setReqNote('');
    flash('Sent - your server is alerted');
    window.setTimeout(() => {
      setRequests((current) => current.map((request) => (request.id === id && request.status === 'OPEN' ? { ...request, status: 'ACK' } : request)));
    }, 3600);
  }

  function cancelRequest(id) {
    setRequests((current) => current.map((request) => (request.id === id ? { ...request, status: 'CANCELLED' } : request)));
    flash('Request cancelled');
  }

  function reorder(id) {
    const order = orders.find((entry) => entry.id === id);
    if (!order) return;
    setCart((current) => {
      const next = current.slice();
      order.lines.forEach((line) => {
        const index = next.findIndex((entry) => entry.key === line.key);
        if (index >= 0) next[index] = { ...next[index], qty: next[index].qty + line.qty };
        else next.push({ ...line });
      });
      return next;
    });
    setScreen('cart');
    flash('Added again - review and send');
  }

  function reset() {
    setScreen('welcome');
    setCart([]);
    setOrders([]);
    setRequests([]);
    setConfirm(false);
  }

  const selectedItem = menu.find((entry) => entry.id === selectedId) || null;
  const cartCount = cart.reduce((sum, line) => sum + line.qty, 0);
  const cartTotal = cart.reduce((sum, line) => sum + line.unit * line.qty, 0);
  const hasLive = orders.some((order) => order.step < 4);

  const computed = useMemo(() => {
    const query = search.trim().toLowerCase();
    const visibleItems = menu
      .filter((item) => (cat === 'all' || (cat === 'veg' ? item.veg : item.cat === cat)))
      .filter((item) => !query || item.name.toLowerCase().includes(query) || item.desc.toLowerCase().includes(query));
    const hero = menu
      .filter((item) => (item.tags || []).includes('chef') && !item.soldOut)
      .sort((a, b) => b.price - a.price)[0];
    return { visibleItems, hero };
  }, [cat, menu, search]);

  const lineViews = (lines, editable) =>
    lines.map((line) => ({
      ...line,
      hasVariant: Boolean(line.variantLabel),
      hasMods: Boolean(line.modSummary),
      lineTotal: money(line.unit * line.qty),
      qtyLabel: `${line.qty}x`,
      editing: editable && editingKey === line.key,
      showNote: editable && Boolean(line.notes) && editingKey !== line.key,
      showAddNote: editable && !line.notes && editingKey !== line.key,
      draftNote,
      onBeginNote: () => {
        setEditingKey(line.key);
        setDraftNote(line.notes || '');
      },
      onDraftNote: setDraftNote,
      onCommitNote: () => setLineNote(line.key, draftNote),
      onInc: () => incKey(line.key),
      onDec: () => decKey(line.key),
    }));

  const orderViews = [...orders].reverse().map((order) => {
    const step = order.step;
    return {
      ...order,
      totalLabel: money(order.total),
      lines: lineViews(order.lines, false),
      stageLabel: orderSteps[step].label,
      showEta: step < 3,
      ready: step === 3,
      served: step >= 4,
      etaLabel: step < 3 ? String(etaByStep[step]) : '',
      progressPct: ((step + 1) / orderSteps.length) * 100,
      steps: orderSteps.map((entry, index) => ({
        ...entry,
        num: index + 1,
        done: index < step,
        now: index === step,
        todo: index > step,
      })),
      onReorder: () => reorder(order.id),
    };
  });

  const billLines = [];
  orders.forEach((order) => {
    order.lines.forEach((line) => {
      const key = `${line.name}|${line.variantLabel || ''}`;
      const existing = billLines.find((entry) => entry.key === key);
      if (existing) {
        existing.qty += line.qty;
        existing.total += line.unit * line.qty;
      } else {
        billLines.push({ key, name: line.name, qty: line.qty, total: line.unit * line.qty });
      }
    });
  });

  const checkout = {
    lines: billLines.map((line) => ({ name: line.name, qtyLabel: `${line.qty}x`, lineTotal: money(line.total) })),
    total: money(orders.reduce((sum, order) => sum + order.total, 0)),
    count: orders.reduce((sum, order) => sum + order.count, 0),
    ordersLabel: `${orders.length} ${orders.length === 1 ? 'order' : 'orders'}`,
  };

  const requestViews = requests.map((request) => ({
    ...request,
    hasNote: Boolean(request.note),
    canCancel: request.status === 'OPEN',
    onCancel: () => cancelRequest(request.id),
    statusLabel: request.status === 'OPEN' ? 'Open' : request.status === 'ACK' ? 'Acknowledged' : 'Cancelled',
  }));

  const itemActions = {
    openItem,
    addSimple,
    subSimple,
    qtyFor,
    openAr: (id) => {
      setSelectedId(id);
      setShowAR(true);
    },
  };

  const activeScreen = isOnline ? screen : 'offline';

  return (
    <AppShell
      activeScreen={activeScreen}
      cartCount={cartCount}
      hasLive={hasLive}
      menuChromeCompact={isOnline && screen === 'menu' && menuChromeCompact}
      onNavigate={go}
      onSettings={() => setSettingsOpen(true)}
      settingsOpen={settingsOpen}
      setSettingsOpen={setSettingsOpen}
      tableLabel={tableLabel}
      venueName={venueName}
    >
      {isOnline ? (
        <>
      {screen === 'welcome' ? (
        <WelcomePage
          picks={menu.filter((item) => !item.soldOut && (item.tags || []).length).slice(0, 2)}
          onGoHelp={() => go('help')}
          onGoMenu={() => go('menu')}
          onOpenItem={openItem}
          tableLabel={tableLabel}
          venueName={venueName}
        />
      ) : null}
      {screen === 'menu' ? (
        <MenuPage
          cartCount={cartCount}
          cartTotalLabel={money(cartTotal)}
          categories={categories}
          activeCategory={cat}
          hero={computed.hero}
          items={computed.visibleItems}
          itemActions={itemActions}
          onCategory={setCat}
          onGoCart={() => go('cart')}
          onChromeCompactChange={setMenuChromeCompact}
          onOpenSearch={openSearch}
          search={search}
        />
      ) : null}
      {screen === 'search' ? (
        <SearchPage
          items={menu}
          query={search}
          setQuery={setSearch}
          onBack={() => go('menu')}
          onOpenItem={openItem}
        />
      ) : null}
      {screen === 'item' && selectedItem ? (
        <ItemDetailPage
          item={selectedItem}
          detail={details[selectedItem.id] || {}}
          menuItems={menu}
          qty={qty}
          setQty={setQty}
          variant={variant}
          setVariant={setVariant}
          mods={mods}
          setSingleMod={(groupId, optionId) => setMods({ ...mods, [groupId]: optionId })}
          toggleMultiMod={toggleMultiMod}
          modOptions={modOptions}
          onAdd={addToOrder}
          onBack={() => go('menu')}
          onOpenAr={() => setShowAR(true)}
          onOpenPair={openItem}
        />
      ) : null}
      {screen === 'cart' ? (
        <CartPage
          cartCount={cartCount}
          cartEmpty={cart.length === 0}
          cartLines={lineViews(cart, true)}
          cartTotalLabel={money(cartTotal)}
          estWaitLabel={cart.length ? `About ${Math.max(...cart.map((line) => line.time || 12)) + 4} minutes` : ''}
          onBack={() => go('menu')}
          onBackMenu={() => go('menu')}
          onSend={sendOrder}
          tableLabel={tableLabel}
        />
      ) : null}
      {screen === 'placed' ? <PlacedPage onBackMenu={() => go('menu')} onViewOrder={() => go('track')} /> : null}
      {screen === 'track' ? (
        <TrackingPage
          confirm={confirm}
          noOrders={orders.length === 0}
          orders={orderViews}
          onCloseBill={closeBill}
          onGoHelp={() => go('help')}
          onGoMenu={() => go('menu')}
        />
      ) : null}
      {screen === 'help' ? (
        <ServiceRequestPage
          onBack={() => go('menu')}
          onReqNote={setReqNote}
          onReqType={setReqType}
          onSendReq={sendRequest}
          reqNote={reqNote}
          reqType={reqType}
          requests={requestViews}
          tiles={requestTiles}
        />
      ) : null}
      {screen === 'checkout' ? <CheckoutPage checkout={checkout} onDone={reset} tableLabel={tableLabel} venueName={venueName} /> : null}
      <ArViewer
        open={showAR && Boolean(selectedItem)}
        item={selectedItem}
        onClose={() => setShowAR(false)}
        onPlace={() => flash('AR placement opens on a real device')}
      />
      {menuApiFailed ? <div className="api-note" role="status">Using fallback menu</div> : null}
        </>
      ) : (
        <NoInternetPage onRetry={retryConnection} />
      )}
      {toast ? <div className="toast" role="status">{toast}</div> : null}
    </AppShell>
  );
}

export default function App() {
  return (
    <ThemeProvider>
      <AppContent />
    </ThemeProvider>
  );
}
