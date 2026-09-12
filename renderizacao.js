// renderizacao.js

import * as THREE from 'https://unpkg.com/three@0.160.0/build/three.module.js';
import { OrbitControls } from 'https://unpkg.com/three@0.160.0/examples/jsm/controls/OrbitControls.js';

let cena, camera, renderizador, controles;
let raycaster, mouse;
let elementosInterativos = [];
let gruposCamadas = {};
let estadoEstratificado = false;

// Alvos matemáticos para a animação suave de estratificação
const alvosZ = { anexos: 0, externa: 0, uveal: 0, refringente: 0, interna: 0 };

const materiais = {
    transparenteVidro: new THREE.MeshPhysicalMaterial({ color: 0xffffff, transmission: 0.9, opacity: 1, transparent: true, roughness: 0.1, ior: 1.5 }),
    brancoEsclera: new THREE.MeshStandardMaterial({ color: 0xfdfdfd, roughness: 0.8 }),
    vermelhoMusculo: new THREE.MeshStandardMaterial({ color: 0xcc3333, roughness: 0.7 }),
    azulIris: new THREE.MeshStandardMaterial({ color: 0x1f51ff, roughness: 0.5 }),
    escuroCoroide: new THREE.MeshStandardMaterial({ color: 0x3d0000, roughness: 0.9 }),
    laranjaRetina: new THREE.MeshStandardMaterial({ color: 0xffa500, roughness: 0.6 }),
    amareloNervo: new THREE.MeshStandardMaterial({ color: 0xffd700, roughness: 0.5 }),
    gelatinaVitreo: new THREE.MeshPhysicalMaterial({ color: 0xadd8e6, transmission: 0.6, opacity: 0.8, transparent: true, roughness: 0.2 }),
    ossoOrbita: new THREE.MeshStandardMaterial({ color: 0xe3dac9, wireframe: true, transparent: true, opacity: 0.3 })
};

export function inicializarRenderizacao(containerId) {
    const container = document.getElementById(containerId);

    cena = new THREE.Scene();
    cena.background = new THREE.Color(0x1a1a1a);

    camera = new THREE.PerspectiveCamera(45, container.clientWidth / container.clientHeight, 0.1, 1000);
    camera.position.set(30, 20, 40);

    renderizador = new THREE.WebGLRenderer({ antialias: true });
    renderizador.setSize(container.clientWidth, container.clientHeight);
    renderizador.setPixelRatio(window.devicePixelRatio);
    container.appendChild(renderizador.domElement);

    controles = new OrbitControls(camera, renderizador.domElement);
    controles.enableDamping = true;
    controles.dampingFactor = 0.05;

    const luzAmbiente = new THREE.AmbientLight(0xffffff, 0.6);
    cena.add(luzAmbiente);
    const luzDirecional = new THREE.DirectionalLight(0xffffff, 1.5);
    luzDirecional.position.set(20, 20, 20);
    cena.add(luzDirecional);
    const luzPreenchimento = new THREE.DirectionalLight(0xffffff, 0.5);
    luzPreenchimento.position.set(-20, 0, -20);
    cena.add(luzPreenchimento);

    raycaster = new THREE.Raycaster();
    mouse = new THREE.Vector2();

    construirEstruturasDoOlho();
    animar();

    window.addEventListener('resize', () => {
        camera.aspect = container.clientWidth / container.clientHeight;
        camera.updateProjectionMatrix();
        renderizador.setSize(container.clientWidth, container.clientHeight);
    });
}

function construirEstruturasDoOlho() {
    gruposCamadas = {
        anexos: new THREE.Group(),
        externa: new THREE.Group(),
        uveal: new THREE.Group(),
        refringente: new THREE.Group(),
        interna: new THREE.Group()
    };

    Object.values(gruposCamadas).forEach(grupo => cena.add(grupo));

    // IMPORTANTE: Uso do .clone() nos materiais para permitir brilho independente!

    const orbita = new THREE.Mesh(new THREE.SphereGeometry(14, 32, 32, 0, Math.PI * 2, 0, Math.PI / 1.5), materiais.ossoOrbita.clone());
    orbita.userData = { id: "orbita" };
    gruposCamadas.anexos.add(orbita);

    const palpebra = new THREE.Mesh(new THREE.SphereGeometry(11, 32, 32, 0, Math.PI, 0, Math.PI / 4), new THREE.MeshStandardMaterial({ color: 0xdfb496 }));
    palpebra.rotation.x = Math.PI / 2; palpebra.position.z = 2;
    palpebra.userData = { id: "palpebra_sistema_lacrimal" };
    gruposCamadas.anexos.add(palpebra);

    const geoMusculo = new THREE.CylinderGeometry(0.8, 0.8, 10);
    geoMusculo.translate(0, 5, 0);
    for (let i = 0; i < 4; i++) {
        const musculo = new THREE.Mesh(geoMusculo, materiais.vermelhoMusculo.clone());
        musculo.rotation.x = Math.PI / 2; musculo.position.z = -2;
        if (i === 0) musculo.position.y = 9;
        if (i === 1) musculo.position.y = -9;
        if (i === 2) { musculo.position.x = 9; musculo.position.y = 0; }
        if (i === 3) { musculo.position.x = -9; musculo.position.y = 0; }
        musculo.userData = { id: "musculos_extraoculares" };
        gruposCamadas.anexos.add(musculo);
        elementosInterativos.push(musculo);
    }

    const esclera = new THREE.Mesh(new THREE.SphereGeometry(9, 64, 64, 0, Math.PI * 2, Math.PI * 0.15, Math.PI), materiais.brancoEsclera.clone());
    esclera.rotation.x = -Math.PI / 2;
    esclera.userData = { id: "esclera" };
    gruposCamadas.externa.add(esclera);

    const cornea = new THREE.Mesh(new THREE.SphereGeometry(6, 64, 64, 0, Math.PI * 2, 0, Math.PI * 0.25), materiais.transparenteVidro.clone());
    cornea.rotation.x = Math.PI / 2; cornea.position.z = 5;
    cornea.userData = { id: "cornea" };
    gruposCamadas.externa.add(cornea);

    const conjuntiva = new THREE.Mesh(new THREE.SphereGeometry(9.1, 64, 64, 0, Math.PI * 2, Math.PI * 0.15, Math.PI * 0.4), new THREE.MeshPhysicalMaterial({ color: 0xffcccc, transmission: 0.9, opacity: 0.3, transparent: true }));
    conjuntiva.rotation.x = -Math.PI / 2;
    conjuntiva.userData = { id: "conjuntiva" };
    gruposCamadas.externa.add(conjuntiva);

    const coroide = new THREE.Mesh(new THREE.SphereGeometry(8.8, 64, 64, 0, Math.PI * 2, Math.PI * 0.15, Math.PI), materiais.escuroCoroide.clone());
    coroide.rotation.x = -Math.PI / 2;
    coroide.userData = { id: "coroide" };
    gruposCamadas.uveal.add(coroide);

    const iris = new THREE.Mesh(new THREE.TorusGeometry(3, 1.5, 16, 64), materiais.azulIris.clone());
    iris.scale.z = 0.1; iris.position.z = 7;
    iris.userData = { id: "iris" };
    gruposCamadas.uveal.add(iris);

    const corpoCiliar = new THREE.Mesh(new THREE.TorusGeometry(4.2, 0.8, 16, 64), materiais.vermelhoMusculo.clone());
    corpoCiliar.position.z = 6.5;
    corpoCiliar.userData = { id: "corpo_ciliar" };
    gruposCamadas.uveal.add(corpoCiliar);

    const humorAquoso = new THREE.Mesh(new THREE.SphereGeometry(5.8, 32, 32, 0, Math.PI * 2, 0, Math.PI * 0.2), new THREE.MeshPhysicalMaterial({ color: 0x00ffff, transmission: 1, opacity: 0.4, transparent: true }));
    humorAquoso.rotation.x = Math.PI / 2; humorAquoso.position.z = 5;
    humorAquoso.userData = { id: "humor_aquoso" };
    gruposCamadas.refringente.add(humorAquoso);

    const cristalino = new THREE.Mesh(new THREE.SphereGeometry(2.5, 32, 32), materiais.transparenteVidro.clone());
    cristalino.scale.z = 0.4; cristalino.position.z = 5.5;
    cristalino.userData = { id: "cristalino" };
    gruposCamadas.refringente.add(cristalino);

    const vitreo = new THREE.Mesh(new THREE.SphereGeometry(8.4, 64, 64), materiais.gelatinaVitreo.clone());
    vitreo.userData = { id: "vitreo" };
    gruposCamadas.refringente.add(vitreo);

    const retina = new THREE.Mesh(new THREE.SphereGeometry(8.6, 64, 64, 0, Math.PI * 2, Math.PI * 0.15, Math.PI), materiais.laranjaRetina.clone());
    retina.rotation.x = -Math.PI / 2;
    retina.userData = { id: "retina" };
    gruposCamadas.interna.add(retina);

    const nervoOptico = new THREE.Mesh(new THREE.CylinderGeometry(1.2, 1.2, 8, 32), materiais.amareloNervo.clone());
    nervoOptico.rotation.x = Math.PI / 2; nervoOptico.position.z = -12;
    nervoOptico.userData = { id: "nervo_optico" };
    gruposCamadas.interna.add(nervoOptico);

    elementosInterativos.push(orbita, palpebra, esclera, cornea, conjuntiva, coroide, iris, corpoCiliar, humorAquoso, cristalino, vitreo, retina, nervoOptico);
}

function animar() {
    requestAnimationFrame(animar);
    controles.update();

    // Interpolação Linear (Lerp) para a animação segura de estratificação
    gruposCamadas.anexos.position.z += (alvosZ.anexos - gruposCamadas.anexos.position.z) * 0.05;
    gruposCamadas.externa.position.z += (alvosZ.externa - gruposCamadas.externa.position.z) * 0.05;
    gruposCamadas.uveal.position.z += (alvosZ.uveal - gruposCamadas.uveal.position.z) * 0.05;
    gruposCamadas.refringente.position.z += (alvosZ.refringente - gruposCamadas.refringente.position.z) * 0.05;
    gruposCamadas.interna.position.z += (alvosZ.interna - gruposCamadas.interna.position.z) * 0.05;

    renderizador.render(cena, camera);
}

export function alternarEstratificacao() {
    estadoEstratificado = !estadoEstratificado;
    
    // Agora apenas mudamos a variável alvo, o Loop Animar cuida de mover de forma segura
    alvosZ.anexos = estadoEstratificado ? 15 : 0;
    alvosZ.externa = estadoEstratificado ? 5 : 0;
    alvosZ.uveal = estadoEstratificado ? 0 : 0;
    alvosZ.refringente = estadoEstratificado ? -5 : 0;
    alvosZ.interna = estadoEstratificado ? -10 : 0;
}

export function verificarClique(eventoMouse, containerElement) {
    const rect = containerElement.getBoundingClientRect();
    mouse.x = ((eventoMouse.clientX - rect.left) / containerElement.clientWidth) * 2 - 1;
    mouse.y = -((eventoMouse.clientY - rect.top) / containerElement.clientHeight) * 2 + 1;

    raycaster.setFromCamera(mouse, camera);
    const intersecoes = raycaster.intersectObjects(elementosInterativos, false);

    if (intersecoes.length > 0) {
        return intersecoes[0].object.userData.id;
    }
    return null;
}

export function destacarEstrutura(id) {
    elementosInterativos.forEach(obj => {
        if (obj.material && obj.material.emissive) {
            if (obj.userData.id === id) {
                obj.material.emissive.setHex(0x555555); // Acende a parte clicada
            } else {
                obj.material.emissive.setHex(0x000000); // Apaga as outras
            }
        }
    });
}
