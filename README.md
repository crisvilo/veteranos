# Asociación de Veteranos de la Fuerza Pública — Buenavista, Córdoba

Sitio web estático en HTML, CSS y JavaScript moderno. No requiere Node.js, servidor propio, base de datos, autenticación ni panel administrativo. Está preparado para publicación directa en GitHub Pages.

## Funcionalidades
- Secciones independientes tipo pestaña: Inicio, Nosotros, Misión y visión, Principios y valores, Galería y Contacto. Al cambiar de sección se ocultan las demás y la página vuelve al inicio del panel.
- Diseño responsive para móviles, tabletas y escritorio, con tema claro y oscuro; la preferencia se guarda en `localStorage` cuando está disponible.\n- Colores inspirados en el emblema institucional: verde, dorado, azul y blanco.\n- Logotipo suministrado incluido en `assets/images/logo.jpg`.\n- Contacto institucional: Asociación de Veteranos de la Fuerza Pública de Buenavista Córdoba; NIT 901885276-1; representante legal César Gregorio Martinez Llorente.
- Galería con exactamente 40 registros iniciales, búsqueda local, filtro por categoría, carrusel automático, pausa, miniaturas, teclado y visor ampliado.
- Sección de contacto con los datos de la asociación, NIT y representante legal; no incluye formulario de envío.
- Redes sociales ocultas si sus URL no están configuradas.
- Contenido institucional separado en JSON.
- Marcadores SVG locales para evitar imágenes rotas durante la primera ejecución.

## Importante antes de publicar
Los textos de historia, misión, visión, objetivos, principios y valores son una propuesta inicial y deben validarse con la asociación. Los 40 SVG de galería y `hero.svg` son marcadores abstractos, no fotografías reales. Reemplázalos por recursos aprobados y actualiza los metadatos. No se han inventado cuentas sociales ni una dirección de correo.

## Configuración de contenido
Edita `assets/data/site-content.json`:
- `organization.tagline`, `intro`, `description`, `history`, `objectives`
- `mission`, `vision`, `principles`, `values`
- `email`: correo oficial real
- `socials`: URL completa de Instagram, Facebook, YouTube y TikTok. Deja `""` si no existe una cuenta oficial.

Si `email` está vacío o no es válido, el botón del formulario se desactiva. El contacto muestra los datos de representación legal y no contiene formulario ni recopila información personal.

Edita `assets/data/gallery.json` para cambiar títulos, descripciones, categorías, texto alternativo, etiquetas, rutas y orden. Debe conservar 40 registros para mantener el requisito inicial. Cada ruta `src` apunta a un archivo de `assets/images/`.

## Navegación independiente\nCada pestaña muestra un único panel de contenido. Los enlaces internos a otra sección cambian de panel sin mantener las demás secciones apiladas verticalmente. El diseño adapta la navegación y las tarjetas a móviles, tabletas y computadores.\n\n## Ejecutar localmente
Como el sitio usa `fetch()` para leer JSON, ábrelo mediante un servidor estático local, no haciendo doble clic en `index.html` (algunos navegadores bloquean `fetch` en `file://`). Opciones:
- Extensión Live Server de Visual Studio Code.
- Cualquier servidor estático local ya instalado.

No se requiere compilación.

## Publicar en GitHub Pages

### 1. Crear repositorio
Crea un repositorio vacío en GitHub, por ejemplo `force-veterans`. No inventes el nombre de usuario: usa la URL que GitHub te muestre.

### 2. Configurar Git
Instala Git si aún no está instalado y abre PowerShell o Git Bash en la carpeta del proyecto. Ejecuta:

```bash
git init
git add .
git commit -m "Publicar sitio institucional Asociación de Veteranos de la Fuerza Pública de Buenavista, Córdoba"
git branch -M main
git remote add origin https://github.com/TU-USUARIO/TU-REPOSITORIO.git
git push -u origin main
```

Reemplaza `TU-USUARIO` y `TU-REPOSITORIO` por los valores reales. Si ya existe un remoto, revisa `git remote -v` antes de añadir otro.

### 3. Activar Pages
1. Abre el repositorio en GitHub.
2. Ve a **Settings → Pages**.
3. En **Build and deployment**, selecciona **Deploy from a branch**.
4. Selecciona `main` y la carpeta `/(root)`.
5. Guarda y espera a que termine la publicación.

La URL se mostrará en la misma pantalla. En un repositorio de proyecto suele tener el formato `https://TU-USUARIO.github.io/TU-REPOSITORIO/`; no uses ese formato como URL oficial hasta comprobar la URL real asignada.

### 4. Comprobar
- Abre la URL pública y revisa las seis secciones.
- Comprueba que el tema cambia y persiste al recargar.
- Prueba búsqueda, categoría, carrusel, pausa, miniaturas y visor con Escape.
- Revisa las herramientas de desarrollador del navegador por errores 404 o JavaScript.
- Prueba al menos en móvil y escritorio.
- Verifica que el correo y los enlaces sociales son oficiales.
- Confirma que todas las imágenes sustituidas cargan correctamente.

### 5. Actualizar
Edita los archivos de contenido o imágenes, después ejecuta:

```bash
git add .
git commit -m "Actualizar contenido y galería"
git push
```

GitHub Pages publicará la nueva versión cuando finalice el despliegue.

## Pruebas y limitaciones conocidas
- Se generó una estructura con 40 identificadores únicos y 40 rutas SVG diferentes.
- Los marcadores SVG son locales y distintos entre sí; deben reemplazarse por fotografías reales.
- Las comprobaciones automáticas de integridad del JSON y de cantidad de registros se ejecutaron al generar el paquete.
- No se afirma haber ejecutado pruebas reales en navegadores, lectores de pantalla ni un despliegue de GitHub Pages desde esta sesión.
- El envío real de correo depende de la aplicación de correo del visitante y de que se configure una dirección oficial. Para envío dentro de la web, integra después un proveedor de formularios o una función serverless y documenta su política de privacidad.
- El aviso del formulario es informativo; antes de publicar, ajústalo a la política de tratamiento de datos real de la organización y a la normativa aplicable.

## Licencia
Consulta `LICENSE`. Revisa y adapta los términos antes de distribuir el sitio con fotografías, marcas o contenido de terceros.
