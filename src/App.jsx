import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { MotionConfig, motion, useReducedMotion } from 'motion/react';
import NumberFlow from '@number-flow/react';
import { Command } from 'cmdk';
import * as Dialog from '@radix-ui/react-dialog';
import { Toaster, toast } from 'sonner';
import { Avatar, Icon, Logo } from './Icons.jsx';
import { categories, createOrderSpec, filterProducts, money, products } from './catalog.js';

const easeOut = [0.23, 1, 0.32, 1];
const numberTiming = { duration: 220, easing: 'cubic-bezier(0.23, 1, 0.32, 1)' };
const currencyFormat = { style: 'currency', currency: 'USD', minimumFractionDigits: 2, maximumFractionDigits: 2 };

function Price({ cents, className = '' }) {
  return <span className={'price ' + className} data-cents={cents}>
    <span aria-hidden="true"><NumberFlow value={cents / 100} locales="en-US" format={currencyFormat} transformTiming={numberTiming} spinTiming={numberTiming} opacityTiming={{ duration: 150, easing: 'linear' }} /></span>
    <span className="sr-only">{money(cents)}</span>
  </span>;
}

function ProductCard({ product, onOpen }) {
  const [name, variant] = product.title.split(' — ');
  return <article className={'product-card theme-' + product.category.toLowerCase()} data-testid="product-card" data-product-id={product.id}>
    <button className="card-open" onClick={(event) => onOpen(product, event)} aria-label={'View ' + product.title} />
    <div className="card-top">
      <Avatar product={product} />
      <span className="delivery-pill"><Icon name={product.delivery === 'personal' ? 'user' : 'bolt'} size={12} />{product.delivery === 'personal' ? 'Personal upgrade' : 'Ready access'}</span>
    </div>
    <h3 className="product-title">{name}<span>{variant}</span></h3>
    <p className="product-description">{product.description}</p>
    <div className="card-footer">
      <span className={'warranty ' + (product.warranty === 'No Warranty' ? 'warranty-none' : '')}><Icon name={product.warranty === 'No Warranty' ? 'info' : 'shield'} size={13} />{product.warranty}</span>
      <div className="purchase-row"><div className="card-price"><Price cents={product.priceCents} /><span className="currency-label">USD</span></div><button className="buy-button" aria-label={'Buy ' + product.title} onClick={(event) => onOpen(product, event)}>Buy<Icon name="arrow" size={15} /></button></div>
    </div>
  </article>;
}

function HeroArt() {
  return <div className="hero-art" aria-hidden="true">
    <svg className="orbital-lines" viewBox="0 0 440 270" fill="none">
      <ellipse cx="220" cy="139" rx="190" ry="76" transform="rotate(-21 220 139)" stroke="url(#orbit-stroke)" />
      <ellipse cx="220" cy="139" rx="155" ry="56" transform="rotate(-21 220 139)" stroke="#333339" strokeDasharray="2 6"/>
      <ellipse cx="220" cy="139" rx="116" ry="36" transform="rotate(-21 220 139)" stroke="#26262d"/>
      <path d="M220 12v14M220 250v12M8 139h14M418 139h14" stroke="#33333c"/>
      <circle cx="362" cy="65" r="2.5" fill="#7e7e86"/>
      <circle cx="97" cy="213" r="2" fill="#484850"/>
      <defs><linearGradient id="orbit-stroke" x1="20" y1="210" x2="400" y2="50"><stop stopColor="#19191d"/><stop offset=".5" stopColor="#5c5c65"/><stop offset="1" stopColor="#25252c"/></linearGradient></defs>
    </svg>
    <div className="art-center"><Logo small /><span>YOUR NEXT EDGE</span></div>
    <div className="art-token token-openai"><Avatar product={products[0]} /></div>
    <div className="art-token token-claude"><Avatar product={products[4]} /></div>
    <div className="art-token token-grok"><Avatar product={products[6]} /></div>
    <div className="art-token token-cursor"><Avatar product={products[11]} /></div>
    <span className="art-caption">FRONTIER TOOLS. EVERYDAY ACCESS.</span>
  </div>;
}

function Checkout({ product }) {
  const [quantity, setQuantity] = useState(1);
  const [email, setEmail] = useState('');
  const [copying, setCopying] = useState(false);
  const [orderText, setOrderText] = useState('');
  const [showSpec, setShowSpec] = useState(false);
  const specRef = useRef(null);
  const noWarranty = product.warranty === 'No Warranty';
  const personal = product.delivery === 'personal';

  const submit = async (event) => {
    event.preventDefault();
    let spec;
    try {
      spec = createOrderSpec(product, quantity, email);
    } catch (error) {
      toast.error(error.message);
      return;
    }
    setOrderText(spec);
    setCopying(true);
    try {
      if (!navigator.clipboard?.writeText) throw new Error('Clipboard unavailable');
      await navigator.clipboard.writeText(spec);
      toast.success('Order spec copied', {
        description: 'Ready to share with your seller. No payment has been taken.',
        action: { label: 'View', onClick: () => setShowSpec(true) },
      });
    } catch {
      setShowSpec(true);
      toast.info('Your order spec is ready', { description: 'Select the text below and copy it manually.' });
      requestAnimationFrame(() => {
        specRef.current?.focus();
        specRef.current?.select();
      });
    } finally {
      setCopying(false);
    }
  };

  return <form className="checkout-form" onSubmit={submit}>
    <div className="checkout-scroll">
      <div className="checkout-product"><Avatar product={product} /><span className="eyebrow">{product.category} / PREMIUM ACCESS</span></div>
      <Dialog.Title className="checkout-title">{product.title}</Dialog.Title>
      <Dialog.Description className="checkout-description">{product.description}</Dialog.Description>
      <div className="checkout-facts">
        <div><span>Account type</span><strong>{product.type}</strong></div>
        <div><span>Listed coverage</span><strong className={noWarranty ? 'text-warm' : ''}>{product.warranty}</strong></div>
        <div><span>Delivery method</span><strong>{personal ? 'Personal account upgrade' : 'Account access by email'}</strong></div>
      </div>
      <div className="delivery-note"><span className="note-icon"><Icon name={personal ? 'user' : 'mail'} size={18} /></span><div><h3>{personal ? 'Your account. Your workflow.' : 'Your access, delivered.'}</h3><p>{personal ? 'Receive activation instructions for your existing account by email. Keep your own profile and history.' : 'The seller supplies account access details to your delivery email. The account type is shown above.'}</p></div></div>
      <div className={'coverage-note ' + (noWarranty ? 'coverage-warning' : '')}><Icon name={noWarranty ? 'info' : 'shield'} size={16} /><p>{noWarranty ? 'This plan is sold as-is with no warranty. Please review this before continuing.' : 'Coverage is listed exactly as supplied. Subscription duration and warranty duration may differ; confirm activation and support terms with your seller.'}</p></div>
      <div className="field-group"><label htmlFor="delivery-email">Delivery email</label><div className="input-wrap"><Icon name="mail" size={16} /><input id="delivery-email" data-testid="delivery-email" type="email" required autoComplete="email" value={email} onChange={(event) => setEmail(event.target.value)} placeholder="you@example.com" aria-describedby="email-note" /></div><p id="email-note" className="field-note">Included in your copied order spec. Never enter a password.</p></div>
      <div className="quantity-row"><div><label id="quantity-label">Quantity</label><span>Up to 5 passes per order</span></div><div className="stepper" role="group" aria-labelledby="quantity-label"><button type="button" onClick={() => setQuantity((value) => Math.max(1, value - 1))} disabled={quantity === 1} aria-label="Decrease quantity"><Icon name="minus" size={15} /></button><span aria-live="polite" data-testid="quantity"><NumberFlow value={quantity} transformTiming={numberTiming} spinTiming={numberTiming} /></span><button type="button" onClick={() => setQuantity((value) => Math.min(5, value + 1))} disabled={quantity === 5} aria-label="Increase quantity"><Icon name="plus" size={15} /></button></div></div>
      {noWarranty && <label className="acknowledgment"><input type="checkbox" required name="accept-no-warranty" /><span>I understand that this product has no warranty.</span></label>}
      {showSpec && <div className="order-spec"><label htmlFor="order-spec">Your order specification</label><textarea ref={specRef} id="order-spec" readOnly rows={10} value={orderText} onFocus={(event) => event.currentTarget.select()} /></div>}
    </div>
    <div className="checkout-bottom">
      <div className="total-row"><span>Total<span className="total-detail">{quantity} {quantity === 1 ? 'pass' : 'passes'} · USD</span></span><Price cents={product.priceCents * quantity} className="total-price" /></div>
      <button className="primary-button" type="submit" disabled={copying}><Icon name={copying ? 'clock' : 'copy'} size={17}/>{copying ? 'Copying…' : 'Copy order spec'}<Icon name="arrow" size={17}/></button>
      <p className="checkout-disclaimer"><Icon name="info" size={12}/>No payment or activation occurs on this preview.</p>
    </div>
  </form>;
}

function HowItWorks() {
  return <div className="guide">
    <span className="eyebrow">A LITTLE CLARITY</span>
    <Dialog.Title>Great tools. Simple choices.</Dialog.Title>
    <Dialog.Description>Everything you need to know before choosing your access.</Dialog.Description>
    <ol className="guide-steps">
      <li><span>01</span><div><h3>Find your edge</h3><p>Browse the collection, choose a platform, or press ⌘K / Ctrl+K to search every plan.</p></div></li>
      <li><span>02</span><div><h3>Check the details</h3><p>Review the account type and listed coverage. A subscription period can be longer than its warranty.</p></div></li>
      <li><span>03</span><div><h3>Take your order with you</h3><p>Add a delivery email, then copy your order specification to share with your seller. This preview does not accept payments or activate subscriptions.</p></div></li>
    </ol>
    <div className="guide-footnote"><Icon name="lock" size={16}/><p>Your email stays in this page until you copy it. No passwords, payment details, or account tokens are requested.</p></div>
  </div>;
}

export default function App() {
  const reducedMotion = useReducedMotion();
  const [category, setCategory] = useState('All');
  const [sort, setSort] = useState('featured');
  const [dialogOpen, setDialogOpen] = useState(false);
  const [dialog, setDialog] = useState({ type: 'search', product: products[0], origin: '50% 15%' });
  const [search, setSearch] = useState('');
  const openerRef = useRef(null);
  const searchButtonRef = useRef(null);
  const closeRef = useRef(null);
  const searchInputRef = useRef(null);
  const visible = useMemo(() => filterProducts(category, sort), [category, sort]);

  const openDialog = useCallback((type, event, product) => {
    const trigger = event?.currentTarget;
    if (trigger instanceof HTMLElement) openerRef.current = trigger;
    const rect = (trigger || openerRef.current || searchButtonRef.current)?.getBoundingClientRect();
    const width = type === 'checkout' ? Math.min(480, window.innerWidth - 24) : Math.min(620, window.innerWidth - 32);
    const left = type === 'checkout' && window.innerWidth > 640 ? window.innerWidth - width - 12 : (window.innerWidth - width) / 2;
    const x = rect ? Math.min(width, Math.max(0, rect.left + rect.width / 2 - left)) : width / 2;
    const y = rect ? Math.min(500, Math.max(0, rect.top + rect.height / 2 - 12)) : 40;
    setSearch('');
    setDialog((current) => ({ type, product: product || current.product, origin: x + 'px ' + y + 'px' }));
    setDialogOpen(true);
  }, []);

  useEffect(() => {
    const onKey = (event) => {
      const editing = event.target instanceof HTMLElement && (event.target.isContentEditable || ['INPUT', 'TEXTAREA', 'SELECT'].includes(event.target.tagName));
      if (((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === 'k') || (event.key === '/' && !editing && !dialogOpen)) {
        event.preventDefault();
        if (dialogOpen && dialog.type === 'search') setDialogOpen(false);
        else openDialog('search', { currentTarget: searchButtonRef.current });
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [dialogOpen, dialog.type, openDialog]);

  const openProduct = (product, event) => openDialog('checkout', event, product);

  return <MotionConfig reducedMotion="user">
    <a className="skip-link" href="#collection">Skip to collection</a>
    <header className="site-header"><div className="header-inner">
      <a className="brand-link" href="#" aria-label="Arsik home"><Logo /></a>
      <button ref={searchButtonRef} className="search-trigger" onClick={(event) => openDialog('search', event)} aria-label="Search products" aria-haspopup="dialog"><Icon name="search" size={16}/><span>Find your next tool…</span><kbd>⌘ K</kbd></button>
      <div className="header-status"><span className="status-dot"/><span>Instant auto-delivery</span><span className="preview-label">PREVIEW</span></div>
    </div></header>

    <main className="main-shell">
      <section className="hero" aria-labelledby="hero-title">
        <motion.div className="hero-copy" initial={reducedMotion ? false : { opacity: 0, y: 10, filter: 'blur(4px)' }} animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }} transition={{ duration: 0.26, ease: easeOut }}>
          <div className="hero-eyebrow"><span className="mini-cross">+</span> THE TOOLS. THE POSSIBILITIES.</div>
          <h1 id="hero-title">Your next idea.<br/><span>Without limits.</span></h1>
          <p>The world's best AI, in one curated collection.<br className="desktop-break"/> Less friction. More of what you're here to build.</p>
          <div className="hero-links"><a className="browse-link" href="#collection">Explore the collection<Icon name="arrow" size={16}/></a><button className="text-button" onClick={(event) => openDialog('guide', event)}>How it works<Icon name="external" size={13}/></button></div>
        </motion.div>
        <HeroArt />
      </section>

      <div className="benefits"><span><Icon name="bolt" size={15}/>Access on your terms</span><i/><span><Icon name="shield" size={15}/>Clear coverage, upfront</span><i/><span><Icon name="spark" size={15}/>Built for your workflow</span><span className="benefits-note">FOUR PLATFORMS. ONE PLACE.</span></div>

      <section id="collection" className="collection" aria-labelledby="collection-heading">
        <div className="section-heading"><div><span className="eyebrow">THE COLLECTION</span><h2 id="collection-heading">Find your unfair advantage.</h2></div><span className="product-count" role="status"><NumberFlow value={visible.length} transformTiming={{duration:180,easing:'cubic-bezier(0.23, 1, 0.32, 1)'}} spinTiming={{duration:180,easing:'cubic-bezier(0.23, 1, 0.32, 1)'}} /> products</span></div>
        <div className="collection-toolbar">
          <div className="category-tabs" role="group" aria-label="Filter by platform">
            {categories.map((name) => <button key={name} type="button" aria-pressed={category === name} className={'category-tab ' + (category === name ? 'active' : '')} onClick={() => setCategory(name)}>
              {category === name && <motion.span className="tab-pill" layoutId="category-pill" transition={{ duration: reducedMotion ? 0 : 0.18, ease: easeOut }}/>}
              <span className="tab-label">{name}<span className="tab-count">{name === 'All' ? products.length : products.filter((product) => product.category === name).length}</span></span>
            </button>)}
          </div>
          <div className="sort-control"><label htmlFor="sort-order" className="sr-only">Sort products</label><select id="sort-order" value={sort} onChange={(event) => setSort(event.target.value)}><option value="featured">Recommended</option><option value="price-asc">Price: low to high</option><option value="price-desc">Price: high to low</option></select><Icon name="chevron" size={14}/></div>
        </div>
        <div className="product-grid" aria-label={category + ' products'}>
          {visible.map((product) => <ProductCard key={product.id} product={product} onOpen={openProduct} />)}
        </div>
        <div className="collection-end"><span/><Icon name="spark" size={15}/><p>A little less overhead. A lot more possibility.</p><span/></div>
      </section>

      <section className="closing-note"><div><span className="eyebrow">MADE FOR THE WAY YOU WORK</span><h2>Your tools should keep up with you.</h2><p>From your first prompt to your next big release.</p></div><button className="secondary-button" onClick={(event) => openDialog('search', event)}>Find your plan<Icon name="arrow" size={16}/></button></section>
    </main>

    <footer className="site-footer"><div className="footer-main"><Logo small/><span>Good tools. Great possibilities.</span><nav aria-label="Footer"><button className="text-button" onClick={(event) => openDialog('guide', event)}>How it works</button><a href="https://github.com/arslanyusupovuzb-art/arsik" target="_blank" rel="noreferrer">Source<Icon name="external" size={12}/></a></nav></div><div className="footer-bottom"><span>© {new Date().getFullYear()} Arsik</span><span>Independent storefront preview. Not affiliated with the listed providers.</span><span>USD $</span></div></footer>

    <Dialog.Root open={dialogOpen} onOpenChange={setDialogOpen}>
      <Dialog.Portal>
        <Dialog.Overlay className="dialog-overlay"/>
        <Dialog.Content key={dialog.type} className={'dialog-content ' + (dialog.type === 'checkout' ? 'checkout-drawer' : dialog.type === 'search' ? 'command-dialog' : 'guide-dialog')} style={{'--origin':dialog.origin}}
          onOpenAutoFocus={(event) => {
            event.preventDefault();
            if (dialog.type === 'search') searchInputRef.current?.focus({preventScroll:true});
            else closeRef.current?.focus({preventScroll:true});
          }}
          onCloseAutoFocus={(event) => {
            event.preventDefault();
            const target = openerRef.current?.isConnected ? openerRef.current : searchButtonRef.current;
            target?.focus({preventScroll:true});
          }}
        >
          <Dialog.Close ref={closeRef} className="icon-button dialog-close" aria-label="Close dialog"><Icon name="close" size={18}/></Dialog.Close>
          {dialog.type === 'checkout' && <><div className="drawer-caption"><span className="eyebrow">YOUR NEXT EDGE</span><span className="drawer-step">ORDER DETAILS</span></div><Checkout key={dialog.product.id} product={dialog.product}/></>}
          {dialog.type === 'guide' && <HowItWorks/>}
          {dialog.type === 'search' && <>
            <Dialog.Title className="sr-only">Search the collection</Dialog.Title><Dialog.Description className="sr-only">Search plans by platform, title, coverage, or account type. Use arrow keys to navigate and Enter to view a plan.</Dialog.Description>
            <Command loop label="Product search">
              <div className="command-input-row"><Icon name="search" size={19}/><Command.Input ref={searchInputRef} value={search} onValueChange={setSearch} placeholder="What will you build with?" aria-label="Search the collection"/></div>
              <Command.List>
                <Command.Empty><Icon name="search" size={24}/><strong>No tools found</strong><p>Try “ChatGPT”, “personal”, or “Cursor”.</p></Command.Empty>
                {categories.slice(1).map((name) => <Command.Group key={name} heading={name}>{products.filter((product) => product.category === name).map((product) => <Command.Item key={product.id} value={product.title} keywords={[product.type,product.warranty,product.description]} onSelect={() => openProduct(product)}>
                  <Avatar product={product}/><div className="command-item-copy"><span>{product.title}</span><small>{product.warranty}</small></div><span className="command-price">{money(product.priceCents)}</span><Icon name="arrow" size={14}/>
                </Command.Item>)}</Command.Group>)}
              </Command.List>
              <div className="command-footer"><span><kbd>↑</kbd><kbd>↓</kbd> to navigate <kbd>↵</kbd> to view</span><span><kbd>esc</kbd> to close</span></div>
            </Command>
          </>}
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
    <Toaster theme="dark" position="bottom-right" closeButton visibleToasts={3} toastOptions={{ duration: 4500, className:'arsik-toast', style:{background:'#18181b',border:'1px solid rgba(255,255,255,.1)',color:'#fafafa'} }}/>
  </MotionConfig>;
}
