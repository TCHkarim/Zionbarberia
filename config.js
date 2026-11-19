// Completá con los datos de tu proyecto Firebase (Configuración del proyecto > Tus apps > Web)
window.ZION = {
  firebase: {
    apiKey: "AIzaSyB7U2vw1NTF7vmDkcXGacYYjVVwOyAaS-A",
    authDomain: "zion-c3353.firebaseapp.com",
    projectId: "zion-c3353",
    storageBucket: "zion-c3353.firebasestorage.app",
    messagingSenderId: "211182955628",
    appId: "1:211182955628:web:72dd971c5ac5df16867c49"
  },
  whatsapp: "549351XXXXXXX", // código de país + área + número, sin + ni espacios
  maps: "https://www.google.com/maps/search/?api=1&query=Jujuy+130+C%C3%B3rdoba+Argentina",
  slotMin: 30, // cada cuántos minutos hay un horario
  // 0 = domingo ... 6 = sábado. Sin entrada = cerrado. (Se puede editar desde el panel admin)
  schedule: { 1: ["09:00", "21:00"], 2: ["09:00", "21:00"], 3: ["09:00", "21:00"], 4: ["09:00", "21:00"], 5: ["09:00", "21:00"], 6: ["10:00", "20:00"] },
  // price 0 = se muestra "Consultar". Editá precios y duraciones desde el panel admin.
  services: [
    { id: "corte", name: "Corte", desc: "Fade, texturizado, rizos o clásico.", min: 30, price: 0 },
    { id: "corte-barba", name: "Corte + barba", desc: "Corte completo con arreglo y perfilado de barba.", min: 60, price: 0 },
    { id: "barba", name: "Barba", desc: "Perfilado y arreglo de barba.", min: 30, price: 0 }
  ],
  promo: ""
};
