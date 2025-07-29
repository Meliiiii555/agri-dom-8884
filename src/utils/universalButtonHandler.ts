import { buttonHandlers } from './buttonUtils';

// Fonction pour ajouter des handlers universels aux boutons sans onClick
export function addUniversalButtonHandlers() {
  // Attendre que le DOM soit chargé
  setTimeout(() => {
    const buttons = document.querySelectorAll('button:not([onclick]):not([data-handler-added])');
    const links = document.querySelectorAll('a[href="#"]:not([data-handler-added]), a:not([href]):not([data-handler-added])');
    
    // Traiter les boutons
    buttons.forEach((button, index) => {
      const buttonElement = button as HTMLButtonElement;
      
      // Marquer le bouton comme traité
      buttonElement.setAttribute('data-handler-added', 'true');
      
      // Déterminer le type d'action basé sur le contenu du bouton
      const buttonText = buttonElement.textContent?.trim() || '';
      const buttonClass = buttonElement.className || '';
      const parentSection = getParentSection(buttonElement);
      
      // Créer un handler approprié basé sur le contexte
      let handler: () => void;
      
      if (buttonText.toLowerCase().includes('télécharger') || buttonText.toLowerCase().includes('download')) {
        handler = () => {
          const resourceName = buttonText || `Ressource-${index}`;
          window.dispatchEvent(new CustomEvent('download-resource', { 
            detail: { resourceName, resourceType: 'document' }
          }));
        };
      } else if (buttonText.toLowerCase().includes('voir') || buttonText.toLowerCase().includes('view')) {
        handler = () => {
          const documentName = buttonText || `Document-${index}`;
          window.dispatchEvent(new CustomEvent('view-legal-text', { 
            detail: { textId: `doc-${index}`, title: documentName, type: 'document' }
          }));
        };
      } else if (buttonText.toLowerCase().includes('partager') || buttonText.toLowerCase().includes('share')) {
        handler = () => {
          const itemName = buttonText || `Item-${index}`;
          window.dispatchEvent(new CustomEvent('share-legal-text', { 
            detail: { textId: `item-${index}`, title: itemName }
          }));
        };
      } else if (buttonText.toLowerCase().includes('recherche') || buttonText.toLowerCase().includes('search')) {
        handler = () => {
          const searchQuery = buttonText || 'recherche générale';
          window.dispatchEvent(new CustomEvent('immersive-search', { 
            detail: { searchType: 'universelle', query: searchQuery }
          }));
        };
      } else if (buttonText.toLowerCase().includes('ajouter') || buttonText.toLowerCase().includes('add') || buttonText.toLowerCase().includes('créer')) {
        handler = () => {
          const formType = parentSection || 'général';
          window.dispatchEvent(new CustomEvent('open-form-modal', { 
            detail: { formType, title: `Nouveau ${formType}` }
          }));
        };
      } else if (buttonText.toLowerCase().includes('modifier') || buttonText.toLowerCase().includes('edit')) {
        handler = () => {
          const itemName = buttonText || `Item-${index}`;
          window.dispatchEvent(new CustomEvent('edit-saved-search', { 
            detail: { searchName: itemName }
          }));
        };
      } else if (buttonText.toLowerCase().includes('supprimer') || buttonText.toLowerCase().includes('delete')) {
        handler = () => {
          const itemName = buttonText || `Item-${index}`;
          window.dispatchEvent(new CustomEvent('delete-saved-search', { 
            detail: { searchName: itemName }
          }));
        };
      } else if (buttonText.toLowerCase().includes('favoris') || buttonText.toLowerCase().includes('favorite')) {
        handler = () => {
          const itemName = buttonText || `Item-${index}`;
          window.dispatchEvent(new CustomEvent('add-to-favorites', { 
            detail: { itemType: 'document', itemName }
          }));
        };
      } else if (buttonText.toLowerCase().includes('approuver') || buttonText.toLowerCase().includes('approve')) {
        handler = () => {
          const documentName = buttonText || `Document-${index}`;
          window.dispatchEvent(new CustomEvent('approve-document', { 
            detail: { documentTitle: documentName }
          }));
        };
      } else if (buttonText.toLowerCase().includes('rejeter') || buttonText.toLowerCase().includes('reject')) {
        handler = () => {
          const documentName = buttonText || `Document-${index}`;
          window.dispatchEvent(new CustomEvent('reject-document', { 
            detail: { documentTitle: documentName }
          }));
        };
      } else if (buttonText.toLowerCase().includes('exporter') || buttonText.toLowerCase().includes('export')) {
        handler = () => {
          const fileName = buttonText || `Export-${index}`;
          window.dispatchEvent(new CustomEvent('download-legal-text', { 
            detail: { textId: `export-${index}`, title: fileName, format: 'PDF' }
          }));
        };
      } else if (buttonText.toLowerCase().includes('imprimer') || buttonText.toLowerCase().includes('print')) {
        handler = () => {
          const documentName = buttonText || `Document-${index}`;
          window.dispatchEvent(new CustomEvent('show-notification', { 
            detail: { type: 'success', message: `Impression de "${documentName}" en cours...` }
          }));
          setTimeout(() => window.print(), 500);
        };
      } else if (buttonText.toLowerCase().includes('envoyer') || buttonText.toLowerCase().includes('send') || buttonText.toLowerCase().includes('submit')) {
        handler = () => {
          const formName = parentSection || 'formulaire';
          window.dispatchEvent(new CustomEvent('submit-form', { 
            detail: { formType: 'universal', title: formName }
          }));
        };
      } else if (buttonText.toLowerCase().includes('annuler') || buttonText.toLowerCase().includes('cancel')) {
        handler = () => {
          window.dispatchEvent(new CustomEvent('show-notification', { 
            detail: { type: 'info', message: 'Action annulée' }
          }));
        };
      } else if (buttonText.toLowerCase().includes('fermer') || buttonText.toLowerCase().includes('close')) {
        handler = () => {
          // Fermer les modales ou revenir en arrière
          const modals = document.querySelectorAll('[id*="modal"], [class*="modal"]');
          if (modals.length > 0) {
            modals.forEach(modal => {
              const modalElement = modal as HTMLElement;
              modalElement.style.display = 'none';
            });
          }
          window.dispatchEvent(new CustomEvent('show-notification', { 
            detail: { type: 'info', message: 'Fermé' }
          }));
        };
      } else {
        // Handler générique pour tous les autres boutons
        handler = () => {
          const actionType = buttonText || 'Action générique';
          const context = parentSection || 'Application';
          window.dispatchEvent(new CustomEvent('generic-button-click', { 
            detail: { 
              buttonText: actionType, 
              action: 'Clic sur bouton', 
              context: context,
              element: buttonElement.tagName,
              classes: buttonClass
            }
          }));
        };
      }
      
      // Ajouter l'event listener
      buttonElement.addEventListener('click', handler);
    });
    
    // Traiter les liens
    links.forEach((link, index) => {
      const linkElement = link as HTMLAnchorElement;
      
      // Marquer le lien comme traité
      linkElement.setAttribute('data-handler-added', 'true');
      
      // Déterminer le type d'action basé sur le contenu du lien
      const linkText = linkElement.textContent?.trim() || '';
      const linkClass = linkElement.className || '';
      const parentSection = getParentSection(linkElement);
      
      // Créer un handler approprié basé sur le contexte
      let handler: (e: Event) => void;
      
      if (linkText.toLowerCase().includes('voir') || linkText.toLowerCase().includes('détails')) {
        handler = (e: Event) => {
          e.preventDefault();
          const documentName = linkText || `Document-${index}`;
          window.dispatchEvent(new CustomEvent('view-legal-text', { 
            detail: { textId: `link-${index}`, title: documentName, type: 'document' }
          }));
        };
      } else if (linkText.toLowerCase().includes('télécharger') || linkText.toLowerCase().includes('download')) {
        handler = (e: Event) => {
          e.preventDefault();
          const resourceName = linkText || `Ressource-${index}`;
          window.dispatchEvent(new CustomEvent('download-resource', { 
            detail: { resourceName, resourceType: 'document' }
          }));
        };
      } else if (linkText.toLowerCase().includes('lire') || linkText.toLowerCase().includes('consulter')) {
        handler = (e: Event) => {
          e.preventDefault();
          const newsTitle = linkText || `Article-${index}`;
          window.dispatchEvent(new CustomEvent('read-news', { 
            detail: { newsTitle }
          }));
        };
      } else {
        // Handler générique pour tous les autres liens
        handler = (e: Event) => {
          e.preventDefault();
          const actionType = linkText || 'Lien générique';
          const context = parentSection || 'Application';
          window.dispatchEvent(new CustomEvent('generic-button-click', { 
            detail: { 
              buttonText: actionType, 
              action: 'Clic sur lien', 
              context: context,
              element: linkElement.tagName,
              classes: linkClass
            }
          }));
        };
      }
      
      // Ajouter l'event listener
      linkElement.addEventListener('click', handler);
    });

  }, 1000);
}

// Fonction pour déterminer la section parent d'un élément
function getParentSection(element: HTMLElement): string {
  let parent = element.parentElement;
  let depth = 0;
  
  while (parent && depth < 10) {
    const classList = parent.classList;
    const id = parent.id;
    
    // Rechercher des indicateurs de section
    if (id) {
      if (id.includes('legal')) return 'textes-juridiques';
      if (id.includes('procedure')) return 'procédures';
      if (id.includes('search')) return 'recherche';
      if (id.includes('form')) return 'formulaire';
      if (id.includes('news')) return 'actualités';
      if (id.includes('library')) return 'bibliothèque';
      if (id.includes('admin')) return 'administration';
      if (id.includes('help')) return 'aide';
    }
    
    // Rechercher dans les classes
    for (const className of classList) {
      if (className.includes('legal')) return 'textes-juridiques';
      if (className.includes('procedure')) return 'procédures';
      if (className.includes('search')) return 'recherche';
      if (className.includes('form')) return 'formulaire';
      if (className.includes('news')) return 'actualités';
      if (className.includes('library')) return 'bibliothèque';
      if (className.includes('admin')) return 'administration';
      if (className.includes('help')) return 'aide';
    }
    
    // Rechercher dans les attributs data
    const dataSection = parent.getAttribute('data-section');
    if (dataSection) return dataSection;
    
    parent = parent.parentElement;
    depth++;
  }
  
  return 'général';
}

// Fonction pour observer les nouveaux boutons ajoutés dynamiquement
export function observeNewButtons() {
  const observer = new MutationObserver((mutations) => {
    let hasNewButtons = false;
    
    mutations.forEach((mutation) => {
      if (mutation.type === 'childList') {
        mutation.addedNodes.forEach((node) => {
          if (node.nodeType === Node.ELEMENT_NODE) {
            const element = node as Element;
            const newButtons = element.querySelectorAll('button:not([onclick]):not([data-handler-added])');
            const newLinks = element.querySelectorAll('a[href="#"]:not([data-handler-added]), a:not([href]):not([data-handler-added])');
            if (newButtons.length > 0 || newLinks.length > 0) {
              hasNewButtons = true;
            }
          }
        });
      }
    });
    
    if (hasNewButtons) {
      // Délai pour laisser le temps aux composants de se monter
      setTimeout(addUniversalButtonHandlers, 500);
    }
  });
  
  observer.observe(document.body, {
    childList: true,
    subtree: true
  });
  
  return observer;
}

// Fonction d'initialisation complète
export function initializeUniversalButtonHandlers() {
  // Ajouter les handlers aux boutons existants
  addUniversalButtonHandlers();
  
  // Observer les nouveaux boutons
  observeNewButtons();
  
  // Re-scanner périodiquement pour les boutons manqués
  setInterval(addUniversalButtonHandlers, 5000);

}