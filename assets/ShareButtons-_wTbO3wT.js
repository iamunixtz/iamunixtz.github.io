import{a as t,e as d,j as e}from"./index-VsORraxM.js";import{b as n}from"./BlogLayout-CZwx1cAS.js";import{T as k}from"./twitter-OPQ8hNFN.js";/**
 * @license lucide-react v0.462.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const f=t("Clock",[["circle",{cx:"12",cy:"12",r:"10",key:"1mglay"}],["polyline",{points:"12 6 12 12 16 14",key:"68esgv"}]]);/**
 * @license lucide-react v0.462.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const y=t("Facebook",[["path",{d:"M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z",key:"1jg4f8"}]]);/**
 * @license lucide-react v0.462.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const p=t("Link2",[["path",{d:"M9 17H7A5 5 0 0 1 7 7h2",key:"8i5ue5"}],["path",{d:"M15 7h2a5 5 0 1 1 0 10h-2",key:"1b9ql8"}],["line",{x1:"8",x2:"16",y1:"12",y2:"12",key:"1jonct"}]]);/**
 * @license lucide-react v0.462.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const x=t("Linkedin",[["path",{d:"M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z",key:"c2jq9f"}],["rect",{width:"4",height:"12",x:"2",y:"9",key:"mk3on5"}],["circle",{cx:"4",cy:"4",r:"2",key:"bt5ra8"}]]);/**
 * @license lucide-react v0.462.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const w=t("Share2",[["circle",{cx:"18",cy:"5",r:"3",key:"gq8acd"}],["circle",{cx:"6",cy:"12",r:"3",key:"w7nqdw"}],["circle",{cx:"18",cy:"19",r:"3",key:"1xt0gg"}],["line",{x1:"8.59",x2:"15.42",y1:"13.51",y2:"17.49",key:"47mynk"}],["line",{x1:"15.41",x2:"8.59",y1:"6.51",y2:"10.49",key:"1n3mei"}]]);function C({title:r,url:c,description:l=""}){const{toast:s}=d(),i=encodeURIComponent(c),a=encodeURIComponent(r),h=encodeURIComponent(l),o={twitter:`https://twitter.com/intent/tweet?text=${a}&url=${i}`,facebook:`https://www.facebook.com/sharer/sharer.php?u=${i}`,linkedin:`https://www.linkedin.com/shareArticle?mini=true&url=${i}&title=${a}&summary=${h}`},m=async()=>{try{await navigator.clipboard.writeText(c),s({title:"Link copied!",description:"The link has been copied to your clipboard."})}catch{s({title:"Failed to copy",description:"Please try copying the link manually.",variant:"destructive"})}};return e.jsxs("div",{className:"flex flex-wrap items-center gap-2",children:[e.jsxs("span",{className:"flex items-center text-sm text-muted-foreground",children:[e.jsx(w,{className:"h-4 w-4 mr-2"}),"Share:"]}),e.jsxs(n,{size:"sm",variant:"outline",onClick:()=>window.open(o.twitter,"_blank"),className:"hover:text-[#1DA1F2]",children:[e.jsx(k,{className:"h-4 w-4 mr-2"}),"Tweet"]}),e.jsxs(n,{size:"sm",variant:"outline",onClick:()=>window.open(o.facebook,"_blank"),className:"hover:text-[#4267B2]",children:[e.jsx(y,{className:"h-4 w-4 mr-2"}),"Share"]}),e.jsxs(n,{size:"sm",variant:"outline",onClick:()=>window.open(o.linkedin,"_blank"),className:"hover:text-[#0077B5]",children:[e.jsx(x,{className:"h-4 w-4 mr-2"}),"Post"]}),e.jsxs(n,{size:"sm",variant:"outline",onClick:m,children:[e.jsx(p,{className:"h-4 w-4 mr-2"}),"Copy Link"]})]})}export{f as C,C as S};
