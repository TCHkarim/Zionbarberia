import{initializeApp}from"https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import{getFirestore,doc,getDoc,collection,query,where,getDocs,writeBatch}from"https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";
const C=window.ZION,$=s=>document.querySelector(s),$$=s=>[...document.querySelectorAll(s)];
let db;try{if(C.firebase.projectId)db=getFirestore(initializeApp(C.firebase))}catch(e){}
let S={services:C.services,schedule:C.schedule,promo:C.promo,closed:[]};
const wa=t=>`https://wa.me/${C.whatsapp}?text=${encodeURIComponent(t)}`;
const money=n=>n?"$"+Number(n).toLocaleString("es-AR"):"Consultar";
const pad=n=>String(n).padStart(2,"0"),hm=m=>pad(m/60|0)+":"+pad(m%60),mins=s=>+s.slice(0,2)*60+ +s.slice(3);
const today=()=>{const d=new Date();return`${d.getFullYear()}-${pad(d.getMonth()+1)}-${pad(d.getDate())}`};
const toast=m=>{const t=$("#toast");t.textContent=m;t.classList.add("show");setTimeout(()=>t.classList.remove("show"),3500)};

function renderServices(){
  $("#serviceGrid").innerHTML=S.services.map(s=>`<article class="service-card rv"><h3>${s.name}</h3><p>${s.desc||""}</p><div class="price">${money(s.price)}</div><div class="service-bottom"><span>${s.min} min</span><button type="button" data-s="${s.id}">Reservar</button></div></article>`).join("");
  $("#serviceSelect").innerHTML='<option value="" disabled selected>Elegí un servicio</option>'+S.services.map(s=>`<option value="${s.id}">${s.name} · ${money(s.price)}</option>`).join("");
  $("#promoText").textContent=S.promo||"";
  $$("[data-s]").forEach(b=>b.onclick=()=>{$("#serviceSelect").value=b.dataset.s;location.hash="turnos";times()});
  reveal();
}

async function times(){
  const sv=S.services.find(s=>s.id===$("#serviceSelect").value),d=$("#dateInput").value,sel=$("#timeSelect"),st=$("#availabilityStatus");
  sel.disabled=true;sel.innerHTML='<option value="" disabled selected>Elegí servicio y día</option>';
  if(!sv||!d)return;
  const h=S.schedule[new Date(d+"T12:00").getDay()];
  if(!h||(S.closed||[]).includes(d)){st.textContent="Ese día no atendemos. Elegí otro.";return}
  const taken=new Set();
  if(db)try{(await getDocs(query(collection(db,"slots"),where("date","==",d)))).forEach(x=>taken.add(x.data().time))}catch(e){}
  const n=Math.ceil(sv.min/C.slotMin),now=new Date(),free=[];
  for(let t=mins(h[0]);t+sv.min<=mins(h[1]);t+=C.slotMin){
    if(d===today()&&t<=now.getHours()*60+now.getMinutes())continue;
    if(Array.from({length:n},(_,i)=>hm(t+i*C.slotMin)).every(x=>!taken.has(x)))free.push(hm(t));
  }
  if(!free.length){st.textContent="No quedan horarios ese día. Probá con otro.";return}
  sel.innerHTML='<option value="" disabled selected>Elegí un horario</option>'+free.map(t=>`<option>${t}</option>`).join("");
  sel.disabled=false;st.textContent=`${free.length} horarios libres.`;
}

$("#bookingForm").onsubmit=async e=>{
  e.preventDefault();
  const f=new FormData(e.target),sv=S.services.find(s=>s.id===f.get("service")),date=f.get("date"),time=f.get("time");
  const msg=`Hola! Quiero un turno en Zion Barbería: ${sv.name}, el ${date.split("-").reverse().join("/")} a las ${time}. Soy ${f.get("name")}.`;
  if(!db){const a=$("#bookingFallbackLink");a.href=wa(msg);a.hidden=false;return toast("No se pudo guardar el turno")}
  const n=Math.ceil(sv.min/C.slotMin),ids=Array.from({length:n},(_,i)=>`${date}_${hm(mins(time)+i*C.slotMin)}`),b=writeBatch(db),ref=doc(collection(db,"appointments"));
  b.set(ref,{serviceId:sv.id,serviceName:sv.name,date,time,name:f.get("name").trim(),phone:f.get("phone").trim(),email:f.get("email").trim(),notes:f.get("notes").trim(),status:"pendiente",slots:ids,createdAt:Date.now()});
  ids.forEach(id=>b.set(doc(db,"slots",id),{date,time:id.slice(11),aid:ref.id}));
  try{
    await b.commit();
    $("#bookingConfirmationText").textContent=`¡Listo, ${f.get("name")}! Recibimos tu solicitud para ${sv.name} el ${date.split("-").reverse().join("/")} a las ${time}.`;
    $("#bookingWhatsAppDraft").href=wa(msg);$("#bookingConfirmation").hidden=false;e.target.reset();times();
  }catch(err){toast("Ese horario se ocupó. Elegí otro.");times()}
};
$("#serviceSelect").onchange=times;$("#dateInput").onchange=times;$("#dateInput").min=today();

// Interfaz
function reveal(){const o=new IntersectionObserver(es=>es.forEach(x=>{if(x.isIntersecting){x.target.classList.add("in");o.unobserve(x.target)}}),{threshold:.15});$$(".rv:not(.in)").forEach(el=>o.observe(el))}
$("#slats").innerHTML=Array.from({length:14},(_,i)=>`<i style="--i:${i}"></i>`).join("");
const hero=$("#hero");hero.onpointermove=e=>{const r=hero.getBoundingClientRect();hero.style.setProperty("--x",e.clientX-r.left+"px");hero.style.setProperty("--y",e.clientY-r.top+"px")};
$("#menuToggle").onclick=e=>{const o=$("#mainNav").classList.toggle("open");e.currentTarget.setAttribute("aria-expanded",o)};
$$("#mainNav a").forEach(a=>a.addEventListener("click",()=>$("#mainNav").classList.remove("open")));
$$("[data-wa]").forEach(a=>a.href=wa(a.dataset.wa));$$("[data-maps]").forEach(a=>a.href=C.maps);
$("#year").textContent=new Date().getFullYear();
renderServices();
if(db)getDoc(doc(db,"settings","main")).then(s=>{if(s.exists()){S={...S,...s.data()};renderServices()}}).catch(()=>{});
