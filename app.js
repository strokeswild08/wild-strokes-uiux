const projects = window.PROJECTS || [];
const categories = ['All work','Websites','SaaS & Dashboards','Mobile Apps','E-commerce','Game UI','Design Systems','Branding & Graphics'];
const grid = document.querySelector('#project-grid');
const filters = document.querySelector('.filters');
let activeCategory = 'All work';
let shown = 8;
let previousTrigger;
const dialog = document.querySelector('#project-dialog');

categories.forEach(category => {
  const count = category === 'All work' ? projects.length : projects.filter(p => p.category === category).length;
  if (!count) return;
  const button = document.createElement('button');
  button.className = 'filter';
  button.type = 'button';
  button.setAttribute('aria-pressed', String(category === activeCategory));
  button.innerHTML = `${category}<span>${count}</span>`;
  button.addEventListener('click', () => {
    activeCategory = category; shown = 8;
    [...filters.children].forEach(el => el.setAttribute('aria-pressed', String(el === button)));
    renderProjects();
  });
  filters.append(button);
});

function renderProjects() {
  const list = projects.filter(p => activeCategory === 'All work' || p.category === activeCategory);
  grid.replaceChildren();
  document.querySelector('.load-more-wrap')?.remove();
  document.querySelector('#category-heading').textContent = activeCategory === 'All work' ? 'Selected work' : activeCategory;
  document.querySelector('#project-count').textContent = `${list.length} projects`;
  list.slice(0,shown).forEach(project => {
    const card = document.createElement('button');
    card.className = 'project-card'; card.type = 'button';
    card.setAttribute('aria-label', `Explore ${project.title}, ${project.images.length} ${project.images.length === 1 ? 'screen' : 'screens'}`);
    card.innerHTML = `<div class="project-image"><img src="${project.cover}" alt="${project.title} design preview" loading="lazy" width="960" height="640"><span class="project-open" aria-hidden="true">↗</span></div><div class="project-info"><div><h3>${project.title}</h3><p>${project.images.length} ${project.images.length === 1 ? 'screen' : 'screens'} · View project</p></div><span class="project-type">${project.category}</span></div>`;
    card.addEventListener('click', () => openProject(project,card));
    grid.append(card);
  });
  if (shown < list.length) {
    const holder = document.createElement('div'); holder.className = 'load-more-wrap';
    const button = document.createElement('button'); button.className = 'load-more'; button.type = 'button';
    button.textContent = `More projects (${list.length-shown}) ↓`;
    button.addEventListener('click', () => {const firstNew=shown; shown+=8; renderProjects(); grid.children[firstNew]?.focus({preventScroll:true});});
    holder.append(button); grid.after(holder);
  }
}

function openProject(project, trigger) {
  previousTrigger = trigger;
  document.querySelector('#dialog-title').textContent = project.title;
  document.querySelector('#dialog-category').textContent = project.category;
  document.querySelector('#dialog-description').textContent = project.description;
  document.querySelector('#gallery-count').textContent = `${project.images.length} ${project.images.length === 1 ? 'SCREEN' : 'SCREENS'}`;
  const gallery = document.querySelector('#gallery'); gallery.replaceChildren();
  project.images.forEach((image,i) => {
    const figure = document.createElement('figure');
    const img = document.createElement('img'); img.src=image.src; img.alt=image.alt; img.loading=i?'lazy':'eager'; img.draggable=false;
    const caption=document.createElement('figcaption'); caption.textContent=`${String(i+1).padStart(2,'0')} / ${project.title}`;
    figure.append(img,caption); gallery.append(figure);
  });
  dialog.showModal(); dialog.scrollTop=0; document.body.classList.add('modal-open');
}
document.querySelector('#close-dialog').addEventListener('click',()=>dialog.close());
dialog.addEventListener('click',event=>{if(event.target===dialog){const r=dialog.getBoundingClientRect(); if(event.clientX<r.left||event.clientX>r.right||event.clientY<r.top||event.clientY>r.bottom)dialog.close();}});
dialog.addEventListener('close',()=>{document.body.classList.remove('modal-open');previousTrigger?.focus({preventScroll:true});});
document.querySelector('#discord-copy').addEventListener('click',async()=>{
  const status=document.querySelector('#copy-status');
  try{await navigator.clipboard.writeText('wildstrokes23'); status.textContent='Copied! Find us on Discord: wildstrokes23';}
  catch{status.textContent='Discord username: wildstrokes23';}
});
document.addEventListener('contextmenu',event=>event.preventDefault());
document.addEventListener('dragstart',event=>{if(event.target.tagName==='IMG')event.preventDefault();});
document.querySelector('#year').textContent=new Date().getFullYear();
renderProjects();
