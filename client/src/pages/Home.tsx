/**
 * ESTILO: Panel editorial de depuración. La experiencia de delivery ocupa el centro; la consola lateral hace visibles los eventos y estados para la evidencia académica.
 */
import { useEffect, useState } from "react";
import { MapPin, ShoppingBag, Search, SlidersHorizontal, Terminal, CheckCircle2, Clock3, ChevronRight } from "lucide-react";

declare global {
  interface Window { jQuery?: any; $?: any; }
}

type Restaurant = { id: number; name: string; description: string; price: string; category: string; free: boolean; image: string };
type Log = { time: string; event: string; detail: string; tone?: "blue" | "green" | "amber" };

const restaurants: Restaurant[] = [
  { id: 1, name: "Pizzería Bella Vista", description: "Pizza a la leña, albahaca y masa artesanal.", price: "$15.00", category: "pizza", free: true, image: "/manus-storage/localdelivery-pizza_833cd05b.jpg" },
  { id: 2, name: "Hamburguesas El Corral", description: "Hamburguesa premium y papas rústicas.", price: "$12.50", category: "hamburguesa", free: false, image: "/manus-storage/localdelivery-burger_6a03b869.jpg" },
  { id: 3, name: "Verde Local", description: "Bowls frescos con ingredientes de temporada.", price: "$11.00", category: "saludable", free: true, image: "/manus-storage/localdelivery-salad_7b08a05a.jpg" },
];

function now() { return new Date().toLocaleTimeString("es-ES", { hour: "2-digit", minute: "2-digit", second: "2-digit" }); }

export default function Home() {
  const [query, setQuery] = useState("");
  const [freeOnly, setFreeOnly] = useState(false);
  const [cart, setCart] = useState<{ name: string; price: number }[]>([]);
  const [gps, setGps] = useState("GPS: No activo");
  const [logs, setLogs] = useState<Log[]>([
    { time: now(), event: "DOMContentLoaded", detail: "Sistema interactivo inicializado de forma segura.", tone: "blue" },
    { time: now(), event: "DEBUG ESTADO", detail: '{ carrito: [], ubicacionGPS: null }', tone: "green" },
  ]);
  const [activeView, setActiveView] = useState("Inicio");

  const addLog = (event: string, detail: string, tone: Log["tone"] = "blue") => setLogs((old) => [{ time: now(), event, detail, tone }, ...old].slice(0, 8));
  const filtered = restaurants.filter((restaurant) => {
    const matches = `${restaurant.name} ${restaurant.category}`.toLowerCase().includes(query.toLowerCase());
    return matches && (!freeOnly || restaurant.free);
  });
  const total = cart.reduce((sum, item) => sum + item.price, 0);

  useEffect(() => {
    const $ = window.jQuery || window.$;
    if (!$) return;
    $(".js-evidence-card").each(function (this: HTMLElement) { $(this).attr("data-jquery-ready", "true"); });
    addLog("jQuery READY", "Selectores .js-evidence-card preparados.", "green");
    const onScroll = () => { if (window.scrollY > 40) addLog("scroll", "Resumen flotante fijado por desplazamiento.", "amber"); };
    $(window).on("scroll.localdelivery", onScroll);
    return () => $(window).off("scroll.localdelivery", onScroll);
    // La dependencia vacía representa el evento ready de la demo.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleSearch = (value: string) => { setQuery(value); addLog("input", `Query: "${value || "(vacía)"}" · filtrado en caliente.`, "blue"); };
  const handleFree = (checked: boolean) => { setFreeOnly(checked); addLog("change", `Solo envío gratis: ${checked ? "true" : "false"}.`, "amber"); };
  const handleAdd = (restaurant: Restaurant) => {
    const next = [...cart, { name: restaurant.name, price: Number(restaurant.price.replace("$", "")) }];
    setCart(next); addLog("click", `[Carrito] Producto agregado: ${restaurant.name} · total $${next.reduce((s, x) => s + x.price, 0).toFixed(2)}`, "green");
  };
  const handleGPS = () => {
    setGps("Localizando..."); addLog("click", "navigator.geolocation.getCurrentPosition() invocado.", "blue");
    if (!navigator.geolocation) { setGps("GPS no soportado"); addLog("GPS ERROR", "El navegador no soporta la API.", "amber"); return; }
    navigator.geolocation.getCurrentPosition((position) => {
      const location = `${position.coords.latitude.toFixed(4)}, ${position.coords.longitude.toFixed(4)}`;
      setGps(`GPS Activo: ${location}`); addLog("GPS SUCCESS", `Ubicación capturada: ${location}`, "green");
    }, () => { setGps("GPS no disponible"); addLog("GPS ERROR", "Permiso no concedido o ubicación no disponible.", "amber"); });
  };

  return (
    <div className="app-shell">
      <header className="topbar">
        <div className="brand-lockup"><div className="brand-mark"><span /></div><div><div className="eyebrow">LOCAL / DELIVERY</div><h1>LocalDelivery</h1></div></div>
        <div className="top-actions"><div className="gps-status"><MapPin size={15} /><span>{gps}</span></div><button className="profile-button">Edgar A. <span>EA</span></button></div>
      </header>
      <div className="workspace">
        <nav className="sidebar" aria-label="Navegación principal"><div className="nav-label">NAVEGACIÓN</div>{["Inicio", "Comercios", "Pedidos", "Soporte"].map((item) => <button key={item} onClick={() => { setActiveView(item); addLog("click", `Vista activa: ${item}.`, "blue"); }} className={activeView === item ? "nav-item active" : "nav-item"}>{item}<ChevronRight size={15} /></button>)}<div className="sidebar-note"><div className="mini-label">ACTIVIDAD 4</div><p>Programación del lado del cliente</p><span>JavaScript + jQuery</span></div></nav>
        <main className="content"><div className="content-heading"><div><div className="eyebrow">PROYECTO INTEGRADOR / EVIDENCIA FUNCIONAL</div><h2>Pide cerca, decide rápido.</h2><p>Prueba las interacciones del cliente y observa sus trazas en tiempo real.</p></div><div className="date-chip">29 AGO 2026 <span>•</span> DEMO</div></div>
          <section className="control-strip"><div className="search-control"><Search size={18} /><input value={query} onChange={(e) => handleSearch(e.target.value)} placeholder="Buscar comercio o categoría..." aria-label="Buscar comercio" /></div><label className="check-control"><input type="checkbox" checked={freeOnly} onChange={(e) => handleFree(e.target.checked)} /><span>Solo envío gratis</span></label><button className="outline-button" onClick={() => { setQuery(""); setFreeOnly(false); addLog("click", "Filtros restablecidos.", "amber"); }}><SlidersHorizontal size={16} /> Limpiar</button></section>
          <div className="event-rail"><div><span className="event-number">01</span><strong>acción</strong><span>usuario escribe o pulsa</span></div><ChevronRight size={15} /><div><span className="event-number">02</span><strong>evento</strong><span>jQuery captura la interacción</span></div><ChevronRight size={15} /><div><span className="event-number">03</span><strong>resultado</strong><span>DOM y consola se actualizan</span></div></div><section className="section-header"><div><div className="section-kicker">SECCIÓN / COMERCIOS <span className="event-tag">EVENT: RENDER</span></div><h3>Restaurantes disponibles</h3></div><span className="result-count">{filtered.length} resultados</span></section>
          <div className="restaurant-grid">{filtered.map((restaurant) => <article className="restaurant-card js-evidence-card" key={restaurant.id}><img src={restaurant.image} alt={restaurant.name} /><div className="card-content"><div className="card-meta"><span>{restaurant.free ? "ENVÍO GRATIS" : "ENVÍO $2.50"}</span><Clock3 size={13} /> 25–35 min <em>click → add</em></div><h4>{restaurant.name}</h4><p>{restaurant.description}</p><div className="card-bottom"><strong>{restaurant.price}</strong><button className="add-button" onClick={() => handleAdd(restaurant)}>Añadir <ShoppingBag size={15} /></button></div></div></article>)}</div>
          {filtered.length === 0 && <div className="empty-state">No hay comercios que coincidan. Prueba con “pizza” o limpia los filtros.</div>}
          <section className="cart-summary"><div><div className="section-kicker">ESTADO LOCAL / CARRITO</div><h3>{cart.length ? `${cart.length} producto${cart.length > 1 ? "s" : ""} listo${cart.length > 1 ? "s" : ""}` : "Tu carrito está vacío"}</h3></div><div className="cart-total">${total.toFixed(2)} <button onClick={() => addLog("click", cart.length ? "Confirmar pedido ejecutado." : "Checkout bloqueado: carrito vacío.", cart.length ? "green" : "amber")}>Confirmar pedido</button></div></section>
        </main>
        <aside className="evidence-panel"><div className="evidence-heading"><div><div className="eyebrow">DEVTOOLS / LIVE</div><h3><Terminal size={17} /> Evidencias</h3></div><span className="live-dot">LIVE</span></div><div className="evidence-card"><div className="evidence-card-title"><span>ESTADO GLOBAL</span><CheckCircle2 size={16} /></div><div className="state-row"><span>carrito</span><strong>{cart.length} items</strong></div><div className="state-row"><span>total</span><strong>${total.toFixed(2)}</strong></div><div className="state-row"><span>preferencias</span><strong>{freeOnly ? "envío gratis" : "todas"}</strong></div></div><div className="console-title"><span>CONSOLE.LOG / TRAZAS</span><button onClick={() => setLogs([])}>limpiar</button></div><div className="console">{logs.map((log, index) => <div className={`log-entry ${log.tone || ""}`} key={`${log.time}-${index}`}><div><span className="log-time">{log.time}</span><strong>{log.event}</strong></div><p>{log.detail}</p></div>)}{logs.length === 0 && <div className="console-empty">Sin trazas. Interactúa con la interfaz.</div>}</div><div className="event-legend"><div className="mini-label">EVENTOS IMPLEMENTADOS</div><div className="legend-grid"><span>click</span><span>input</span><span>change</span><span>scroll</span><span>GPS API</span><span>ready</span></div></div></aside>
      </div>
      <footer className="footer"><span>© 2026 LocalDelivery</span><span>Actividad 4 · Programación del lado del cliente y jQuery</span><span>HTML5 / DOM / jQuery 3.6</span></footer>
    </div>
  );
}
