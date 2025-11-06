# 🌊 Wave Rider

[![Game Off 2025](https://img.shields.io/badge/Game%20Off-2025-blue?style=for-the-badge)](https://itch.io/jam/game-off-2025)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg?style=for-the-badge)](https://opensource.org/licenses/MIT)
[![Phaser 3](https://img.shields.io/badge/Phaser-3-blueviolet?style=for-the-badge)](https://phaser.io/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?style=for-the-badge&logo=typescript)](https://www.typescriptlang.org/)

> Un endless runner arcade donde surfeas sobre olas infinitas. Salta de cresta en cresta mientras la velocidad aumenta. ¿Cuánto tiempo puedes sobrevivir? 🏄‍♂️

**Juego creado para [Game Off 2025](https://itch.io/jam/game-off-2025)** - Tema: **OLAS**

---

## 🎮 Jugar Ahora

**🕹️ [Jugar en itch.io](https://acahuiche.itch.io/wave-rider)** *(Próximamente)*

---

## 📖 Sobre el Juego

Wave Rider es un juego arcade minimalista donde controlas a un surfista que debe saltar entre olas del océano que se mueven cada vez más rápido. 

### 🎯 Características

- **Un solo botón:** Presiona `SPACE` para saltar - fácil de aprender, difícil de dominar
- **Dificultad progresiva:** La velocidad aumenta constantemente, desafiándote a mejorar
- **High Score:** Compite contra ti mismo y supera tu mejor puntuación
- **Estilo retro:** Pixel art minimalista con paleta de colores oceánica
- **Música synthwave:** Banda sonora energética que aumenta la tensión

### 🎨 Interpretación del Tema "OLAS"

- 🌊 **Literal:** Surfeas sobre olas del océano
- 📊 **Patrón repetitivo:** Las olas vienen en secuencia constante
- ⚡ **Avalancha:** La dificultad te golpea como una oleada imparable
- 〰️ **Ondulación:** El movimiento fluido crea una sensación de flow

---

## 🎮 Controles

| Acción | Tecla |
|--------|-------|
| **Saltar** | `SPACE` o `CLICK` |
| **Reiniciar** | `R` (después de Game Over) |
| **Menú** | `M` (después de Game Over) |
| **Silenciar** | `M` (en menú principal) |

---

## 🛠️ Tecnologías

- **Engine:** [Phaser 3](https://phaser.io/) - Framework de juegos HTML5
- **Lenguaje:** [TypeScript](https://www.typescriptlang.org/) - JavaScript con tipos estáticos
- **Build Tool:** [Webpack 5](https://webpack.js.org/) - Module bundler
- **Hosting:** [itch.io](https://itch.io/) - Plataforma de juegos indie

---

## 🚀 Desarrollo Local

### Prerrequisitos

- [Node.js](https://nodejs.org/) v18 o superior
- npm (viene con Node.js)

### Instalación

```bash
# Clonar el repositorio
git clone https://github.com/ACahuiche/wave-rider.git
cd wave-rider

# Instalar dependencias
npm install

# Iniciar servidor de desarrollo
npm run dev
```

El juego se abrirá automáticamente en tu navegador en `http://localhost:8080`

### Scripts Disponibles

```bash
npm run dev        # Servidor de desarrollo con hot reload
npm run build      # Build de producción optimizado
npm run build:dev  # Build de desarrollo (sin minificar)
```

---

## 📁 Estructura del Proyecto

```
wave-rider/
├── src/
│   ├── scenes/          # Escenas del juego (Menu, Game, GameOver)
│   ├── entities/        # Clases de entidades (Player, Wave)
│   ├── managers/        # Gestores (Score, Audio, Storage)
│   ├── utils/           # Utilidades y constantes
│   ├── assets/          # Assets del juego (sprites, audio)
│   └── main.ts          # Entry point del juego
├── public/              # Assets estáticos
├── dist/                # Build output
├── webpack.config.js    # Configuración de Webpack
├── tsconfig.json        # Configuración de TypeScript
└── package.json         # Dependencias del proyecto
```

---

## 🎨 Assets y Créditos

### Arte
- **Sprites:** Pixel art original creado para este proyecto
- **Inspiración:** Alto's Adventure, Celeste, Crossy Road

### Audio
- **Música:** [Fuente] - [Licencia]
- **SFX:** [Fuente] - [Licencia]

### Herramientas
- **Pixel Art:** [Libresprite](https://libresprite.github.io/)
- **Audio:** [Audacity](https://www.audacityteam.org/) / [BFXR](https://www.bfxr.net/)

*(Los créditos específicos se actualizarán conforme se agreguen assets)*

---

## 🏆 Objetivos del Proyecto

Este es mi primer juego para una Game Jam. Los objetivos son:

- ✅ Completar un juego funcional en 4 semanas
- ✅ Aprender Phaser 3 y TypeScript
- ✅ Crear una experiencia de juego simple pero pulida
- ✅ Participar en la comunidad de Game Off 2025
- ✅ Obtener feedback y mejorar como desarrollador

---

## 📊 Estado del Desarrollo

**Fase Actual:** 🚧 Desarrollo Core

- [x] Setup del proyecto (Phaser + TypeScript + Webpack)
- [x] Configuración de repositorio
- [ ] Mecánicas core del juego
- [ ] Sistema de puntuación
- [ ] UI y menús
- [ ] Arte y animaciones
- [ ] Audio
- [ ] Testing y balance
- [ ] Deploy a itch.io

**Próximo hito:** Mecánicas Core Jugables (Nov 13, 2025)

Ver el [tablero del proyecto](https://linear.app/cosankdev/project/wave-rider-game-jam-a483bfa61e76/overview) para más detalles.

---

## 🤝 Contribuciones

Este es un proyecto de Game Jam personal, por lo que no acepto contribuciones de código en este momento. Sin embargo, ¡el feedback es bienvenido!

Si encuentras un bug o tienes una sugerencia:
- Abre un [Issue](https://github.com/ACahuiche/wave-rider/issues)
- Coméntalo en [itch.io](https://acahuiche.itch.io/wave-rider) después del lanzamiento

---

## 📝 Licencia

Este proyecto está bajo la Licencia MIT - ver el archivo [LICENSE](LICENSE.md) para más detalles.


---

## 🔗 Links

- **🎮 Jugar:** [itch.io](https://acahuiche.itch.io/wave-rider) *(Próximamente)*
- **📦 Código fuente:** [GitHub](https://github.com/ACahuiche/wave-rider.git)
- **🎲 Game Jam:** [Game Off 2025](https://itch.io/jam/game-off-2025)
- **👤 Desarrollador:** [ACahuiche](https://github.com/ACahuiche)

---

## 📸 Screenshots

*(Screenshots se agregarán cuando el juego esté más avanzado)*

![Gameplay](docs/screenshot-gameplay.png)
![Menu](docs/screenshot-menu.png)
![Game Over](docs/screenshot-gameover.png)

---

## 🎓 Aprendizajes

Este proyecto es una oportunidad de aprendizaje. Documentaré mis aprendizajes en el [devlog](docs/DEVLOG.md).

---

<div align="center">

**Hecho con ❤️ por ACahuiche para Game Off 2025**

[⭐ Star este repo](https://github.com/acahuiche/wave-rider) si te gusta el proyecto

</div>