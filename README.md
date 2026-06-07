# Acid Rain Interactive Environmental Education Portal

A modern, responsive, and visually immersive single-page web application (SPA) with hash-based routing built using clean, semantic HTML5, custom Tailwind CSS configurations, and vanilla JavaScript. 

The portal presents comprehensive, scientific information regarding the atmospheric chemistry, ecological devastation, regional and global reach, and modern solutions to acid rain.

---

## 📁 Directory Structure

```text
.antigravity/
├── index.html        # Main HTML skeleton containing structural page layout, sections & routing
├── app.js            # Core JavaScript file (router, pH slider, wind simulator, energy switcher)
├── styles.css        # Custom CSS for custom scrollbars, range inputs, particle float, and fade effects
├── verify-tabs.js    # Integrity & verification script validating routing, DOM tags, & event handlers
└── README.md         # This documentation file
```

---

## 🧪 Interactive Laboratory Elements

### 1. pH Scale Simulator (Home & Overview)
- Adjust a slider from pH 1.0 to 14.0 to inspect rain acidity.
- Demonstrates logarithmic scale difference (e.g., pH 4.0 is 10 times more acidic than pH 5.0, and 100 times more acidic than pure water).
- Spawns dynamic particle chambers matching the acid level:
  - High acidity drops spawn dense clouds of red hydronium ($H^+$) ions.
  - Neutral levels spawn calm, scattered teal water particles.
  - Alkaline levels spawn blue hydroxide ($OH^-$) ions.

### 2. Ecosystem Decay Visualizer (Environmental Impact)
- Drag a dual-state slider to compare a healthy, lush ecosystem (pH 6.5) directly with a severely acidified forest and lake bed (pH 3.5).
- Displays the immediate impact on biodiversity, tree decay, and soil erosion.

### 3. Transboundary Wind & Boundary Simulator (Global Reach)
- Toggle wind speeds (Calm, Moderate, Gale) to see how industrial sulfur dioxide ($SO_2$) and nitrogen oxides ($NO_x$) travel from major industrial hubs across national boundaries directly into Canadian forests (Ontario, Quebec, Atlantic Canada).
- Displays animated wind streaks whose velocity matches the chosen weather pattern.

### 4. Renewable Energy Toggler (Health & Solutions)
- Toggle the region's energy generation between Fossil Fuels and Clean Energy.
- Pushing for renewables clears the atmosphere, swaps smoke particles for floating green leaves, restores solar radiation (Sun & kites), and raises precipitation pH back to normal (pH 5.6).

---

## 🛠️ Verification & Testing

A verification script (`verify-tabs.js`) is included to programmatically check file structures, HTML elements, and JavaScript bindings:

```bash
node verify-tabs.js
```

### Verified Checks:
1. File existence (`index.html`, `app.js`, `styles.css`).
2. Syntactical correctness of JavaScript execution.
3. Matching HTML navigation targets and section containers for all tabs.
4. Inline event bindings (`setPH`, `triggerWind`, `setEnergySource`) map to valid JavaScript functions.
5. Vital DOM ids match between CSS selectors, JavaScript query selectors, and HTML nodes.
