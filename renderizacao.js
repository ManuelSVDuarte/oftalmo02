// renderizacao.js

// Importando o Three.js e o OrbitControls via CDN (ES Modules)
import * as THREE from 'https://unpkg.com/three@0.160.0/build/three.module.js';
import { OrbitControls } from 'https://unpkg.com/three@0.160.0/examples/jsm/controls/OrbitControls.js';

let cena, camera, renderizador, controles;
let raycaster, mouse;
let elementosInterativos = [];
let gruposCamadas = {};
let estadoEstratificado = false;

// Configurações base de materiais para realismo (usando Physically Based Rendering)
const materiais = {
    transparenteVidro: new THREE.MeshPhysicalMaterial({
        color: 0xffffff, transmission: 0.9, opacity: 1, transparent: true, roughness: 0.1, ior: 1.5
    }),
    brancoEsclera: new THREE.MeshStandardMaterial({ color: 0xfdfdfd, roughness: 0.8 }),
    vermelhoMusculo: new THREE.MeshStandardMaterial({ color: 0xcc3333, roughness: 0.7 }),
    azulIris: new THREE.MeshStandardMaterial({ color: 0x1f51ff, roughness: 0.5 }),
    escuroCoroide: new THREE.MeshStandardMaterial({ color: 0x3d0000, roughness: 0.9 }),
    laranjaRetina: new THREE.MeshStandardMaterial({ color: 0xffa500, roughness: 0.6 }),
    amareloNervo: new THREE.MeshStandardMaterial({ color: 0xffd700, roughness: 0.5 }),
    gelatinaVitreo: new THREE.MeshPhysicalMaterial({
        color: 0xadd8e6, transmission: 0.6, opacity: 0.8, transparent: true, roughness: 0.2
    }),
    ossoOrbita: new THREE.MeshStandardMaterial({ color: 0xe3dac9, wireframe: true, transparent: true, opacity: 0.3 })
};

export function inicializarRenderizacao(containerId) {
    const container = document.getElementById(containerId);

    // 1. Configuração da Cena e Câmera
    cena = new THREE.Scene();
    cena.background = new THREE.Color(0x1a1a1a);

    camera = new THREE.PerspectiveCamera(45, container.clientWidth / container.clientHeight, 0.1, 1000);
    camera.position.set(30, 20, 40);

    // 2. Configuração do Renderizador
    renderizador = new THREE.WebGLRenderer({ antialias: true });
    renderizador.setSize(container.clientWidth, container.clientHeight);
    renderizador.setPixelRatio(window.devicePixelRatio);
    container.appendChild(renderizador.domElement);

    // 3. Controles de Órbita (Girar o olho)
    controles = new OrbitControls(camera, renderizador.domElement);
    controles.enableDamping = true;
    controles.dampingFactor = 0.05;

    // 4. Iluminação Realista
    const luzAmbiente = new THREE.AmbientLight(0xffffff, 0.6);
    cena.add(luzAmbiente);
    const luzDirecional = new THREE.DirectionalLight(0xffffff, 1.5);
    luzDirecional.position.set(20, 20, 20);
    cena.add(luzDirecional);
    const luzPreenchimento = new THREE.DirectionalLight(0xffffff, 0.5);
    luzPreenchimento.position.set(-20, 0, -20);
    cena.add(luzPreenchimento);

    // Ferramentas para clique (Raycaster)
    raycaster = new THREE.Raycaster();
    mouse = new THREE.Vector2();

    construirEstruturasDoOlho();
    animar();

    // Responsividade
    window.addEventListener('resize', () => {
        camera.aspect = container.clientWidth / container.clientHeight;
        camera.updateProjectionMatrix();
        renderizador.setSize(container.clientWidth, container.clientHeight);
    });
}

function construirEstruturasDoOlho() {
    // Criando os grupos para permitir a estratificação (separação física)
    gruposCamadas = {
        anexos: new THREE.Group(),
        externa: new THREE.Group(),
        uveal: new THREE.Group(),
        refringente: new THREE.Group(),
        interna: new THREE.Group()
    };

    // Adicionando grupos à cena
    Object.values(gruposCamadas).forEach(grupo => cena.add(grupo));

    // --- 1. ESTRUTURAS ANEXAS (Grupo: anexos) ---
    // Órbita
    const geoOrbita = new THREE.SphereGeometry(14, 32, 32, 0, Math.PI * 2, 0, Math.PI / 1.5);
    const orbita = new THREE.Mesh(geoOrbita, materiais.ossoOrbita);
    orbita.userData = { id: "orbita" };
    gruposCamadas.anexos.add(orbita);

    // Pálpebra e Sistema Lacrimal (Representado por cúpulas frontais)
    const geoPalpebra = new THREE.SphereGeometry(11, 32, 32, 0, Math.PI, 0, Math.PI / 4);
    const palpebra = new THREE.Mesh(geoPalpebra, new THREE.MeshStandardMaterial({ color: 0xdfb496 }));
    palpebra.rotation.x = Math.PI / 2;
    palpebra.position.z = 2;
    palpebra.userData = { id: "palpebra_sistema_lacrimal" };
    gruposCamadas.anexos.add(palpebra);

    // Músculos Extraoculares (4 cilindros ao redor da esclera)
    const geoMusculo = new THREE.CylinderGeometry(0.8, 0.8, 10);
    geoMusculo.translate(0, 5, 0); // Ajustar pivô
    for (let i = 0; i < 4; i++) {
        const musculo = new THREE.Mesh(geoMusculo, materiais.vermelhoMusculo);
        musculo.rotation.x = Math.PI / 2;
        musculo.position.z = -2;
        // Posicionando: Sup, Inf, Medial, Lateral
        if (i === 0) musculo.position.y = 9;
        if (i === 1) musculo.position.y = -9;
        if (i === 2) { musculo.position.x = 9; musculo.position.y = 0; }
        if (i === 3) { musculo.position.x = -9; musculo.position.y = 0; }
        musculo.userData = { id: "musculos_extraoculares" };
        gruposCamadas.anexos.add(musculo);
        elementosInterativos.push(musculo);
    }

    // --- 2. CAMADA EXTERNA (Grupo: externa) ---
    // Esclera (Esfera branca com buraco na frente)
    const geoEsclera = new THREE.SphereGeometry(9, 64, 64, 0, Math.PI * 2, Math.PI * 0.15, Math.PI);
    const esclera = new THREE.Mesh(geoEsclera, materiais.brancoEsclera);
    esclera.rotation.x = -Math.PI / 2;
    esclera.userData = { id: "esclera" };
    gruposCamadas.externa.add(esclera);

    // Córnea (Cúpula transparente frontal)
    const geoCornea = new THREE.SphereGeometry(6, 64, 64, 0, Math.PI * 2, 0, Math.PI * 0.25);
    const cornea = new THREE.Mesh(geoCornea, materiais.transparenteVidro);
    cornea.rotation.x = Math.PI / 2;
    cornea.position.z = 5;
    cornea.userData = { id: "cornea" };
    gruposCamadas.externa.add(cornea);

    // Conjuntiva (Película finíssima sobre a esclera anterior)
    const geoConjuntiva = new THREE.SphereGeometry(9.1, 64, 64, 0, Math.PI * 2, Math.PI * 0.15, Math.PI * 0.4);
    const conjuntiva = new THREE.Mesh(geoConjuntiva, new THREE.MeshPhysicalMaterial({ color: 0xffcccc, transmission: 0.9, opacity: 0.3, transparent: true }));
    conjuntiva.rotation.x = -Math.PI / 2;
    conjuntiva.userData = { id: "conjuntiva" };
    gruposCamadas.externa.add(conjuntiva);


    // --- 3. CAMADA MÉDIA / UVEAL (Grupo: uveal) ---
    // Coróide (Logo abaixo da esclera)
    const geoCoroide = new THREE.SphereGeometry(8.8, 64, 64, 0, Math.PI * 2, Math.PI * 0.15, Math.PI);
    const coroide = new THREE.Mesh(geoCoroide, materiais.escuroCoroide);
    coroide.rotation.x = -Math.PI / 2;
    coroide.userData = { id: "coroide" };
    gruposCamadas.uveal.add(coroide);

    // Íris (Disco com furo - Pupila)
    const geoIris = new THREE.TorusGeometry(3, 1.5, 16, 64);
    const iris = new THREE.Mesh(geoIris, materiais.azulIris);
    iris.scale.z = 0.1; // Achatar o torus para parecer um disco
    iris.position.z = 7;
    iris.userData = { id: "iris" };
    gruposCamadas.uveal.add(iris);

    // Corpo Ciliar (Anel ao redor e atrás da íris)
    const geoCorpoCiliar = new THREE.TorusGeometry(4.2, 0.8, 16, 64);
    const corpoCiliar = new THREE.Mesh(geoCorpoCiliar, materiais.vermelhoMusculo);
    corpoCiliar.position.z = 6.5;
    corpoCiliar.userData = { id: "corpo_ciliar" };
    gruposCamadas.uveal.add(corpoCiliar);


    // --- 4. MEIOS REFRINGENTES (Grupo: refringente) ---
    // Humor Aquoso (Líquido entre a córnea e a íris)
    const geoAquoso = new THREE.SphereGeometry(5.8, 32, 32, 0, Math.PI * 2, 0, Math.PI * 0.2);
    const humorAquoso = new THREE.Mesh(geoAquoso, new THREE.MeshPhysicalMaterial({ color: 0x00ffff, transmission: 1, opacity: 0.4, transparent: true }));
    humorAquoso.rotation.x = Math.PI / 2;
    humorAquoso.position.z = 5;
    humorAquoso.userData = { id: "humor_aquoso" };
    gruposCamadas.refringente.add(humorAquoso);

    // Cristalino (Lente biconvexa atrás da íris)
    const geoCristalino = new THREE.SphereGeometry(2.5, 32, 32);
    const cristalino = new THREE.Mesh(geoCristalino, materiais.transparenteVidro);
    cristalino.scale.z = 0.4; // Achatar para formato biconvexo
    cristalino.position.z = 5.5;
    cristalino.userData = { id: "cristalino" };
    gruposCamadas.refringente.add(cristalino);

    // Humor Vítreo (Preenche o interior)
    const geoVitreo = new THREE.SphereGeometry(8.4, 64, 64);
    const vitreo = new THREE.Mesh(geoVitreo, materiais.gelatinaVitreo);
    vitreo.userData = { id: "vitreo" };
    gruposCamadas.refringente.add(vitreo);


    // --- 5. CAMADA INTERNA (Grupo: interna) ---
    // Retina (Esfera interna)
    const geoRetina = new THREE.SphereGeometry(8.6, 64, 64, 0, Math.PI * 2, Math.PI * 0.15, Math.PI);
    const retina = new THREE.Mesh(geoRetina, materiais.laranjaRetina);
    retina.rotation.x = -Math.PI / 2;
    retina.userData = { id: "retina" };
    gruposCamadas.interna.add(retina);

    // Nervo Óptico (Cilindro saindo da parte posterior)
    const geoNervo = new THREE.CylinderGeometry(1.2, 1.2, 8, 32);
    const nervoOptico = new THREE.Mesh(geoNervo, materiais.amareloNervo);
    nervoOptico.rotation.x = Math.PI / 2;
    nervoOptico.position.z = -12;
    nervoOptico.userData = { id: "nervo_optico" };
    gruposCamadas.interna.add(nervoOptico);

    // Cadastrar todos os meshes para detecção de clique
    elementosInterativos.push(orbita, palpebra, esclera, cornea, conjuntiva, coroide, iris, corpoCiliar, humorAquoso, cristalino, vitreo, retina, nervoOptico);
}

// Loop de renderização contínua
function animar() {
    requestAnimationFrame(animar);
    controles.update();
    renderizador.render(cena, camera);
}

// --- FUNÇÕES EXPORTADAS PARA O APP.JS ---

// Alterna entre o olho fechado (normal) e estratificado (explodido)
export function alternarEstratificacao() {
    estadoEstratificado = !estadoEstratificado;
    
    // Animação simples de translação no eixo Z
    const alvoAnexos = estadoEstratificado ? 15 : 0;
    const alvoExterna = estadoEstratificado ? 5 : 0;
    const alvoUveal = estadoEstratificado ? 0 : 0;
    const alvoRefringente = estadoEstratificado ? -5 : 0;
    const alvoInterna = estadoEstratificado ? -10 : 0;

    // Função de transição suave (Tween improvisado)
    const interpolar = (grupo, alvoZ) => {
        const intervalo = setInterval(() => {
            grupo.position.z += (alvoZ - grupo.position.z) * 0.1;
            if (Math.abs(grupo.position.z - alvoZ) < 0.1) {
                grupo.position.z = alvoZ;
                clearInterval(intervalo);
            }
        }, 16);
    };

    interpolar(gruposCamadas.anexos, alvoAnexos);
    interpolar(gruposCamadas.externa, alvoExterna);
    interpolar(gruposCamadas.uveal, alvoUveal);
    interpolar(gruposCamadas.refringente, alvoRefringente);
    interpolar(gruposCamadas.interna, alvoInterna);
}

// Verifica onde o usuário clicou e retorna o ID da estrutura
export function verificarClique(eventoMouse, containerElement) {
    const rect = containerElement.getBoundingClientRect();
    mouse.x = ((eventoMouse.clientX - rect.left) / containerElement.clientWidth) * 2 - 1;
    mouse.y = -((eventoMouse.clientY - rect.top) / containerElement.clientHeight) * 2 + 1;

    raycaster.setFromCamera(mouse, camera);

    // Intersecta apenas os objetos cadastrados
    const intersecoes = raycaster.intersectObjects(elementosInterativos, false);

    if (intersecoes.length > 0) {
        // Retorna o ID da primeira estrutura tocada pelo mouse
        return intersecoes[0].object.userData.id;
    }
    return null;
}

// Função para destacar a parte selecionada
export function destacarEstrutura(id) {
    elementosInterativos.forEach(obj => {
        if (obj.material && obj.material.emissive) {
            if (obj.userData.id === id) {
                // Brilha levemente a parte selecionada
                obj.material.emissive.setHex(0x555555);
            } else {
                obj.material.emissive.setHex(0x000000);
            }
        }
    });
}
