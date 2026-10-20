import { useId } from 'react';

const paths = {
  search: <><circle cx="10.8" cy="10.8" r="6.8"/><path d="m16 16 4.5 4.5"/></>,
  arrow: <><path d="M4 12h15M13 5l7 7-7 7"/></>,
  chevron: <path d="m8 10 4 4 4-4"/>,
  close: <path d="m6 6 12 12M18 6 6 18"/>,
  shield: <><path d="M12 3 4.5 6v5.6c0 4.6 3.4 7.8 7.5 9.4 4.1-1.6 7.5-4.8 7.5-9.4V6L12 3Z"/><path d="m8.5 11.5 2.3 2.3 4.7-4.7"/></>,
  bolt: <path d="m13.5 2-9 12h7l-1 8 9-12h-7l1-8Z"/>,
  check: <path d="m5 12 4 4L19 6"/>,
  copy: <><rect x="8" y="8" width="12" height="13" rx="2"/><path d="M16 8V5a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h3"/></>,
  mail: <><rect x="3" y="5" width="18" height="14" rx="3"/><path d="m4 7 8 6 8-6"/></>,
  user: <><circle cx="12" cy="8" r="4"/><path d="M4 21v-2a8 8 0 0 1 16 0v2"/></>,
  plus: <path d="M12 5v14M5 12h14"/>,
  minus: <path d="M5 12h14"/>,
  external: <><path d="M13 4h7v7M20 4l-9 9"/><path d="M9 4H5a2 2 0 0 0-2 2v13a2 2 0 0 0 2 2h13a2 2 0 0 0 2-2v-4"/></>,
  clock: <><circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/></>,
  spark: <><path d="m12 3 2.5 6.5L21 12l-6.5 2.5L12 21l-2.5-6.5L3 12l6.5-2.5L12 3Z"/></>,
  info: <><circle cx="12" cy="12" r="9"/><path d="M12 11v6M12 7h.01"/></>,
  lock: <><rect x="5" y="10" width="14" height="11" rx="2"/><path d="M8 10V7a4 4 0 0 1 8 0v3"/></>,
};
export function Icon({ name, size = 18, ...props }) {
  return <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.65" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" {...props}>{paths[name] || paths.spark}</svg>;
}
export function Logo({ small = false }) {
  return <span className={'brand ' + (small ? 'brand-small' : '')}>
    <svg width="28" height="28" viewBox="0 0 64 64" fill="currentColor" aria-hidden="true"><path d="M9 50 28 12h10L19 50Zm18 0 14-28 14 28H41l-5-10-5 10Z"/></svg>
    <span>arsik<span className="brand-period">.</span></span>
  </span>;
}

export function Avatar({ product, className = '' }) {
  const uid = useId().replaceAll(':', '');
  const metal = 'metal-' + uid;
  const hue = product.category === 'ChatGPT' ? '#72d9b7' : product.category === 'Claude' ? '#d99b76' : product.category === 'Cursor' ? '#b1dce3' : '#e6e6eb';
  const fill = 'url(#' + metal + ')';
  let glyph;
  switch (product.theme) {
    case 'sprint':
      glyph = <><ellipse cx="24" cy="24" rx="20" ry="15" transform="rotate(-25 24 24)" stroke="#75d6b8" strokeOpacity=".22" strokeDasharray="37 18"/><g stroke="#62d4ab" strokeWidth="2">{Array.from({length:6},(_,i)=><path key={i} d="M24 10c9 0 13 8 8 14l-8 4-5-3V15Z" transform={'rotate(' + i*60 + ' 24 24)'} />)}</g><circle cx="24" cy="24" r="4" fill="#0d1c16"/></>;
      break;
    case 'shield':
      glyph = <><path d="m24 7 14 8v16l-14 9-14-9V15Z" fill={fill} fillOpacity=".15" stroke={fill}/><path d="m24 12 10 6v11l-10 7-10-7V18Z" stroke="#68c6a8" strokeOpacity=".75"/><path d="m18 23 4 4 8-8" stroke="#c4f5df" strokeWidth="2"/></>;
      break;
    case 'personal':
      glyph = <><circle cx="21" cy="17" r="7" fill={fill} fillOpacity=".8"/><path d="M9 36c0-8 5-12 12-12s12 4 12 12" fill={fill} fillOpacity=".4"/><circle cx="33" cy="32" r="8" fill="#16392b" stroke="#7cd9b6"/><path d="m29 32 3 3 5-6" stroke="#c9ffe7" strokeWidth="1.8"/></>;
      break;
    case 'plane':
      glyph = <><g stroke="#68c6a8" strokeOpacity=".12">{[12,24,36].map(n=><g key={n}><path d={'M'+n+' 0v48'}/><path d={'M0 '+n+'h48'}/></g>)}</g><path d="m9 23 30-13-11 30-6-12-13-5Z" stroke="#9cecc9" strokeWidth="1.5" fill="#376f58" fillOpacity=".25"/><path d="m22 28 17-18" stroke="#9cecc9" strokeWidth="1.5"/></>;
      break;
    case 'turbine':
      glyph = <><g transform="translate(19 23)">{Array.from({length:12},(_,i)=><path key={i} d="m-1-4 2-10 4 2-3 9Z" transform={'rotate('+i*30+')'} fill={fill} opacity=".9"/>)}</g><circle cx="29" cy="25" r="10" stroke="#dca276" strokeOpacity=".6"/><circle cx="19" cy="23" r="4" fill="#edc7aa"/><circle cx="29" cy="25" r="3" fill="#a46543"/></>;
      break;
    case 'starburst':
      glyph = <><g transform="translate(24 21)" stroke="#d9946e" strokeWidth="2.4">{Array.from({length:12},(_,i)=><path key={i} d="M0-5v-11" transform={'rotate('+i*30+')'}/>)}</g><rect x="24" y="31" width="21" height="12" rx="3" fill="#241b16" stroke="#bb805e" strokeOpacity=".6"/><text x="34.5" y="39.5" textAnchor="middle" fontSize="7" fill="#f1c8a8" fontFamily="monospace">50X</text></>;
      break;
    case 'orbit':
      glyph = <><ellipse cx="23" cy="24" rx="13" ry="17" transform="rotate(39 23 24)" stroke={fill} strokeWidth="1.5"/><path d="M12 38 37 8" stroke="#fafafa" strokeWidth="3.2"/><path d="m26 32 9 8" stroke="#b8b8c0" strokeWidth="1.4"/></>;
      break;
    case 'eclipse':
      glyph = <><circle cx="23" cy="22" r="13" fill={fill}/><circle cx="19.5" cy="18.5" r="12" fill="#101115"/><path d="M34 9v6m-3-3h6" stroke="#fafafa"/><rect x="29" y="32" width="16" height="11" rx="3" fill="#27272a" stroke="#6c6c74"/><text x="37" y="40" textAnchor="middle" fill="#eeeeef" fontFamily="monospace" fontSize="7">7D</text></>;
      break;
    case 'sphere':
      glyph = <><circle cx="24" cy="24" r="15" fill={fill} fillOpacity=".12" stroke={fill}/><ellipse cx="24" cy="24" rx="8" ry="15" stroke={fill}/><ellipse cx="24" cy="24" rx="20" ry="5" transform="rotate(-27 24 24)" stroke="#fafafa" strokeWidth="1.3"/><path d="M10 17c10 6 18 6 28 0M10 31c10-6 18-6 28 0" stroke={fill} strokeOpacity=".4"/></>;
      break;
    case 'rings':
      glyph = <>{[-55,0,55].map(angle=><ellipse key={angle} cx="24" cy="24" rx="17" ry="8" transform={'rotate('+angle+' 24 24)'} stroke={fill} strokeWidth="1.5"/>)}<circle cx="24" cy="24" r="2" fill="white"/></>;
      break;
    case 'monolith':
      glyph = <><path d="m15 9 17 4v26l-17-4Z" fill="#29262e" stroke="#7e7888"/><path d="m32 13 5-5v25l-5 6" fill="#121015" stroke="#53505d"/><path d="m8 40 31-34" stroke="#b8a5d5" strokeWidth="4" strokeOpacity=".35"/><path d="m8 40 31-34" stroke="white" strokeWidth="1.5"/></>;
      break;
    case 'terminal':
      glyph = <><rect x="6" y="9" width="36" height="30" rx="5" fill="#11191d" stroke="#7a9299" strokeOpacity=".6"/><path d="M6 17h36" stroke="#7a9299" strokeOpacity=".4"/><circle cx="11" cy="13" r="1" fill="#acc7cd"/><circle cx="15" cy="13" r="1" fill="#acc7cd"/><path d="m20 20 14 8-7 2-3 7-4-17Z" fill={fill} stroke="#d2f2f5"/></>;
      break;
    default:
      glyph = <><path d="m12 14 12-7 12 7v15l-12 7-12-7Z" fill="#181e22" stroke="#a0b3bc" strokeOpacity=".6"/><path d="m12 14 12 7 12-7M24 21v15" stroke="#b6c9d0" strokeOpacity=".5"/>{[[6,12],[41,9],[38,36],[8,34],[17,41],[43,25]].map(([x,y],i)=><rect key={i} x={x} y={y} width="2.5" height="2.5" fill="#b1c2cc" opacity=".7"/>)}<path d="m26 22 15 9-7 2-3 7-5-18Z" fill={fill} stroke="white" strokeWidth=".8"/></>;
  }
  return <span className={'avatar avatar-' + product.category.toLowerCase() + ' ' + className} aria-hidden="true">
    <svg width="48" height="48" viewBox="0 0 48 48" fill="none">
      <defs><linearGradient id={metal} x1="8" y1="6" x2="39" y2="43" gradientUnits="userSpaceOnUse"><stop stopColor="#f8f8fa"/><stop offset=".34" stopColor={hue}/><stop offset=".65" stopColor="#747780"/><stop offset="1" stopColor="#e5e8ee"/></linearGradient></defs>
      {glyph}
    </svg>
  </span>;
}
