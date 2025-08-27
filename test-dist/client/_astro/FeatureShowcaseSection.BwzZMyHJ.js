import{j as e}from"./jsx-runtime.D_zvdyIk.js";import{r as n}from"./index.CQ95-tCy.js";const $=({title:p,subtitle:c,quote:a})=>{const s=n.useRef(null),[t,g]=n.useState(!1),[f,i]=n.useState(!1);n.useEffect(()=>{const r=setTimeout(()=>{i(!0)},500);return()=>clearTimeout(r)},[]),n.useEffect(()=>{if(!f)return;const r=new IntersectionObserver(d=>{d.forEach(w=>{w.isIntersecting&&!t&&g(!0)})},{threshold:.5,rootMargin:"-100px 0px"});s.current&&r.observe(s.current);const o=document.querySelector(".scroll-indicator");return o&&o.addEventListener("click",()=>{const d=document.querySelector(".feature-showcase-item");d&&d.scrollIntoView({behavior:"smooth"})}),()=>{s.current&&r.unobserve(s.current)}},[t,f]);const u=p.split(" ");return e.jsxs("section",{ref:s,className:"quoted-hero min-h-screen flex flex-col justify-center items-center text-center p-8 relative bg-gradient-to-br from-[#0a0e27] to-[#151935] overflow-hidden",children:[e.jsx("h1",{className:"text-5xl md:text-6xl lg:text-7xl font-extrabold mb-6 text-white",children:u.map((r,o)=>e.jsx("span",{className:`inline-block mr-4 ${t?o%2===0?"animate-slideInLeft":"animate-slideInRight":""}`,style:{animationDelay:t?`${o*.15}s`:"0s",opacity:t?void 0:0,transform:t?void 0:o%2===0?"translateX(-100%)":"translateX(100%)",animationFillMode:"forwards"},children:e.jsx("span",{className:"bg-gradient-to-r from-purple-500 to-blue-500 bg-clip-text text-transparent",children:r})},o))}),e.jsx("p",{className:`text-xl md:text-2xl text-gray-400 max-w-3xl mb-24 ${t?"animate-slideInRight":""}`,style:{opacity:t?void 0:0,transform:t?void 0:"translateX(100%)",animationDelay:t?"0.6s":"0s",animationFillMode:"forwards"},children:c}),e.jsxs("div",{className:`quote-container max-w-4xl mx-auto flex items-start gap-12 px-8 ${t?"animate-slideInLeft":""}`,style:{opacity:t?void 0:0,transform:t?void 0:"translateX(-100%)",animationDelay:t?"0.9s":"0s",animationFillMode:"forwards"},children:[e.jsxs("div",{className:"quote-content flex-1 relative",children:[e.jsx("div",{className:"quote-mark absolute -top-5 -left-8 text-7xl text-cyan-400 opacity-80 font-serif leading-none",children:'"'}),e.jsx("p",{className:"quote-text text-base md:text-lg leading-relaxed text-white m-0 font-normal italic tracking-normal",children:a.text})]}),e.jsxs("div",{className:"quote-attribution flex items-center gap-6 flex-shrink-0",children:[e.jsxs("div",{className:"author-info text-right",children:[e.jsx("div",{className:"author-name text-lg font-semibold text-white mb-1",children:a.authorName}),e.jsx("div",{className:"author-title text-sm text-gray-400",children:a.authorTitle})]}),a.authorAvatar?e.jsx("img",{src:a.authorAvatar,alt:a.authorName,className:"author-avatar w-14 h-14 rounded-full object-cover"}):e.jsx("div",{className:"author-avatar w-14 h-14 rounded-full bg-purple-500 flex items-center justify-center text-white font-semibold text-xl",children:a.authorName.split(" ").map(r=>r[0]).join("")})]})]}),e.jsx("div",{className:`scroll-indicator absolute bottom-8 left-1/2 -translate-x-1/2 cursor-pointer ${t?"animate-fadeIn":""}`,style:{opacity:t?void 0:0,animationDelay:t?"1.2s":"0s",animationFillMode:"forwards"},children:e.jsx("svg",{className:"w-8 h-8 fill-purple-500 animate-bounce",viewBox:"0 0 24 24",children:e.jsx("path",{d:"M12 16l-6-6h12z"})})}),e.jsx("style",{children:`
        @keyframes slideInLeft {
          from {
            opacity: 0;
            transform: translateX(-100%);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }

        @keyframes slideInRight {
          from {
            opacity: 0;
            transform: translateX(100%);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }

        @keyframes fadeIn {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }

        @keyframes fadeInUp {
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .animate-slideInLeft {
          animation: slideInLeft 0.8s cubic-bezier(0.4, 0, 0.2, 1) forwards;
        }

        .animate-slideInRight {
          animation: slideInRight 0.8s cubic-bezier(0.4, 0, 0.2, 1) forwards;
        }

        .animate-fadeIn {
          animation: fadeIn 0.8s ease forwards;
        }

        .animate-fadeInUp {
          animation: fadeInUp 1s ease forwards;
        }

        .animation-delay-300 {
          animation-delay: 0.3s;
        }

        .animation-delay-600 {
          animation-delay: 0.6s;
        }

        .animation-delay-900 {
          animation-delay: 0.9s;
        }

        .animation-delay-1200 {
          animation-delay: 1.2s;
        }

        @keyframes bounce {
          0%, 20%, 50%, 80%, 100% {
            transform: translateX(-50%) translateY(0);
          }
          40% {
            transform: translateX(-50%) translateY(-10px);
          }
          60% {
            transform: translateX(-50%) translateY(-5px);
          }
        }

        .animate-bounce {
          animation: bounce 2s infinite;
        }

        /* Responsive adjustments */
        @media (max-width: 968px) {
          .quote-container {
            flex-direction: column;
            gap: 1.5rem;
          }

          .quote-attribution {
            flex-direction: row-reverse;
            align-self: flex-end;
          }

          .author-info {
            text-align: left;
          }

          .quote-mark {
            left: -20px;
            font-size: 60px;
          }
        }
      `})]})},X=({id:p,title:c,heading:a,paragraphs:s,learnMoreLink:t,layout:g="left",sectionNumber:f})=>{const i=n.useRef(null),u=n.useRef(null),r=n.useRef(null),o=n.useRef(null),[d,w]=n.useState(!1),b=n.useRef(null),R=n.useRef(0),M=()=>{const x=["bg-gradient-to-br from-[#0a0e27] to-[#0f1429]","bg-gradient-to-br from-[#0f1429] to-[#151935]","bg-gradient-to-br from-[#151935] to-[#0a0e27]","bg-gradient-to-br from-[#0a0e27] to-[#1a1f3a]"];return x[f%x.length]};n.useEffect(()=>{const x={threshold:.3,rootMargin:"0px 0px -100px 0px"},y=new IntersectionObserver(l=>{l.forEach(v=>{v.isIntersecting&&w(!0)})},x);i.current&&y.observe(i.current);const N=(l,v,I)=>l+(v-l)*I,m=()=>{if(!i.current||!r.current||!o.current)return;const l=i.current.getBoundingClientRect(),v=o.current.offsetHeight,I=r.current.offsetHeight;let k=0;if(l.top>=0)k=Math.max(0,Math.min(1,1-l.top/window.innerHeight));else{const S=Math.abs(l.top);k=Math.min(1,(window.innerHeight+S)/l.height)}const E=v-I,F=E-k*E,L=N(R.current,F,.1);R.current=L,r.current&&(r.current.style.transform=`translate3d(0, ${L}px, 0)`),u.current&&(l.top<=window.innerHeight&&l.bottom>=0?u.current.style.opacity="1":u.current.style.opacity="0")},h=()=>{b.current&&cancelAnimationFrame(b.current),b.current=requestAnimationFrame(m)};return window.addEventListener("scroll",h,{passive:!0}),window.addEventListener("resize",h,{passive:!0}),m(),()=>{window.removeEventListener("scroll",h),window.removeEventListener("resize",h),b.current&&cancelAnimationFrame(b.current),i.current&&y.unobserve(i.current)}},[]);const j=g==="right";return e.jsxs("section",{ref:i,id:p,className:`feature-showcase-item min-h-[50vh] flex items-center py-12 px-8 relative ${M()} ${d?"in-view":""}`,children:[e.jsxs("div",{className:`feature-container max-w-7xl mx-auto grid gap-16 items-start w-full pt-8 ${j?"lg:grid-cols-[1.5fr_1fr]":"lg:grid-cols-[1fr_1.5fr]"} grid-cols-1`,children:[e.jsx("div",{ref:u,className:`feature-title lg:sticky lg:top-8 lg:h-[calc(50vh-4rem)] opacity-0 transition-opacity duration-[800ms] ${j?"lg:order-2":""}`,children:e.jsxs("div",{ref:r,className:"relative will-change-transform",style:{transform:"translateZ(0)",WebkitFontSmoothing:"antialiased",backfaceVisibility:"hidden"},children:[t&&e.jsxs(e.Fragment,{children:[e.jsxs("a",{href:t,className:"inline-flex items-center gap-2 text-sm md:text-base text-blue-400 hover:text-blue-300 transition-colors group cursor-pointer mb-2",children:[e.jsx("span",{className:"underline-offset-4 hover:underline",children:"Learn more"}),e.jsx("svg",{className:"w-4 h-4 transform group-hover:translate-x-1 transition-transform",fill:"none",viewBox:"0 0 24 24",stroke:"currentColor",strokeWidth:"2",children:e.jsx("path",{strokeLinecap:"round",strokeLinejoin:"round",d:"M13 7l5 5m0 0l-5 5m5-5H6"})})]}),e.jsx("br",{})]}),t?e.jsx("a",{href:t,className:"inline-block hover:opacity-90 transition-opacity",children:e.jsx("h2",{className:"text-3xl md:text-4xl lg:text-5xl font-extrabold leading-tight bg-gradient-to-r from-purple-500 to-blue-500 bg-clip-text text-transparent",children:c})}):e.jsx("h2",{className:"text-3xl md:text-4xl lg:text-5xl font-extrabold leading-tight bg-gradient-to-r from-purple-500 to-blue-500 bg-clip-text text-transparent mb-4",children:c})]})}),e.jsxs("div",{ref:o,className:`feature-content opacity-0 translate-x-12 transition-all duration-[800ms] ${j?"lg:order-1":""} ${d?"opacity-100 translate-x-0":""}`,children:[e.jsx("h3",{className:"text-2xl md:text-3xl mb-6 text-white font-bold",children:a}),s.map((x,y)=>{const N=x.split(/(\*\*.*?\*\*)/g);return e.jsx("p",{className:"text-lg md:text-xl leading-relaxed text-gray-400 mb-6",children:N.map((m,h)=>m.startsWith("**")&&m.endsWith("**")?e.jsx("strong",{className:"text-gray-300 font-semibold",children:m.slice(2,-2)},h):m)},y)})]})]}),e.jsx("div",{className:"absolute bottom-0 left-[10%] right-[10%] h-px bg-gradient-to-r from-transparent via-purple-500 to-transparent opacity-20"}),e.jsx("style",{children:`
        .feature-showcase-item.in-view .feature-title {
          opacity: 1;
        }

        .feature-showcase-item.in-view .feature-content {
          opacity: 1;
          transform: translateX(0);
        }

        /* Mobile responsive adjustments */
        @media (max-width: 1024px) {
          .feature-title {
            position: relative !important;
            height: auto !important;
            top: auto !important;
            margin-bottom: 2rem;
          }

          .feature-title > div {
            transform: none !important;
          }
        }
      `})]})},T=({data:p})=>{const c=p;return n.useEffect(()=>{const a=()=>{const s=window.pageYOffset;document.querySelectorAll(".shape").forEach((g,f)=>{const i=.5+f*.1;g.style.transform=`translateY(${s*i}px)`})};return window.addEventListener("scroll",a,{passive:!0}),()=>{window.removeEventListener("scroll",a)}},[]),e.jsxs("div",{className:"feature-showcase-section",children:[e.jsx($,{title:c.hero.title,subtitle:c.hero.subtitle,quote:c.hero.quote}),c.features.map((a,s)=>e.jsx(X,{id:a.id,title:a.title,heading:a.heading,paragraphs:a.paragraphs,learnMoreLink:a.learnMoreLink,layout:s%2===0?"left":"right",sectionNumber:s},s)),e.jsx("style",{children:`
        /* Custom scrollbar */
        ::-webkit-scrollbar {
          width: 8px;
        }

        ::-webkit-scrollbar-track {
          background: #0a0e27;
        }

        ::-webkit-scrollbar-thumb {
          background: linear-gradient(135deg, #8b5cf6 0%, #3b82f6 100%);
          border-radius: 4px;
        }

        /* Floating shapes (invisible but available) */
        .shape {
          position: absolute;
          opacity: 0.05;
          animation: float 20s infinite ease-in-out;
          display: none; /* Hidden as requested */
        }

        .shape-1 {
          width: 200px;
          height: 200px;
          background: linear-gradient(135deg, #8b5cf6 0%, #3b82f6 100%);
          border-radius: 30% 70% 70% 30% / 30% 30% 70% 70%;
          top: 10%;
          left: 5%;
          animation-delay: 0s;
        }

        .shape-2 {
          width: 150px;
          height: 150px;
          background: linear-gradient(135deg, #3b82f6 0%, #8b5cf6 100%);
          border-radius: 70% 30% 30% 70% / 70% 70% 30% 30%;
          top: 60%;
          right: 10%;
          animation-delay: 5s;
        }

        .shape-3 {
          width: 100px;
          height: 100px;
          background: linear-gradient(135deg, #8b5cf6 0%, #3b82f6 100%);
          border-radius: 50%;
          bottom: 20%;
          left: 15%;
          animation-delay: 10s;
        }

        @keyframes float {
          0%, 100% {
            transform: translate(0, 0) rotate(0deg);
          }
          33% {
            transform: translate(30px, -30px) rotate(120deg);
          }
          66% {
            transform: translate(-20px, 20px) rotate(240deg);
          }
        }
      `})]})};export{T as default};
