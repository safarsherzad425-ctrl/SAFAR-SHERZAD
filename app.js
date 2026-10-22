/*
  SAFAR SHERZAD — Supabase configuration
  1) Create a Supabase project.
  2) Run schema.sql in Supabase SQL Editor.
  3) Replace SUPABASE_URL and SUPABASE_ANON_KEY below with your project's values.
  4) In Supabase Authentication, create/sign up the Owner account for safarsherzad425@gmail.com.
  Never put a service_role key in this public website.
*/
const SUPABASE_URL = "https://ehqvtxoxpzxemrlboutg.supabase.co/";
const SUPABASE_ANON_KEY = "sb_publishable_CR3eSj8Hfw8zYPOFR87_Ww_rI9is5gs";
const OWNER_EMAIL = "safarsherzad425@gmail.com";
const configured = !SUPABASE_URL.includes("PASTE_") && !SUPABASE_ANON_KEY.includes("PASTE_");
const client = configured && window.supabase ? window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY) : null;
const $ = id => document.getElementById(id);
let products = [];
let isOwner = false;
const demoProducts = [
  {
    id: "demo1",
    name: "مۆبایلی زیرەک",
    price: 250000,
    category: "مۆبایل",
    description: "مۆبایلی کوالێتی بەرز"
  },
  {
    id: "demo2",
    name: "کۆمپیوتەر",
    price: 750000,
    category: "کۆمپیوتەر",
    description: "کۆمپیوتەر بۆ کار و یاری"
  },
  {
    id: "demo3",
    name: "کۆنسۆڵی یاری",
    price: 450000,
    category: "یاری",
    description: "ئامێری یاری"
  },
  {
    id: "demo4",
    name: "کاتژمێری زیرەک",
    price: 85000,
    category: "ئەلیکترۆنیات",
    description: "کاتژمێری زیرەک بۆ ڕۆژانە"
  }
];
function money(n){return new Intl.NumberFormat("en-US").format(Number(n)||0)+" د.ع"}
function safe(s){return String(s??"").replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]))}
function renderProducts(){
 const q=$("search").value.trim().toLowerCase();
 const shown=products.filter(p=>(p.name+" "+(p.category||"")+" "+(p.description||"")).toLowerCase().includes(q));
 $("productGrid").innerHTML=shown.length?shown.map(p=>`<article class="product"><img loading="lazy" src="${safe(p.image_url||"https://placehold.co/600x400?text=SAFAR+SHERZAD")}" alt="${safe(p.name)}" onerror="this.src='https://placehold.co/600x400?text=SAFAR+SHERZAD'"><div class="pbody"><span class="cat">${safe(p.category||"کاڵا")}</span><h3>${safe(p.name)}</h3><p>${safe(p.description||"بۆ زانیاری زیاتر پەیوەندی بکە.")}</p><div class="price">${money(p.price)}</div><a class="order" href="mailto:${OWNER_EMAIL}?subject=${encodeURIComponent("داواکاری: "+p.name)}">داواکردنی کاڵا</a></div></article>`).join(""):`<div class="empty">هیچ کاڵایەک نەدۆزرایەوە.</div>`;
 $("status").textContent=shown.length?`ژمارەی کاڵاکان: ${shown.length}`:"";
}
async function loadProducts(){
 if(!client){products=demoProducts;$("status").textContent="دۆخی پێشبینین: بۆ بەکارهێنانی ئۆنلاین، Supabase ڕێکبخە.";renderProducts();return}
 const {data,error}=await client.from("products").select("*").eq("published",true).order("created_at",{ascending:false});
 if(error){$("status").textContent="کێشە لە وەرگرتنی کاڵاکان. ڕێکخستنی Supabase بپشکنە.";console.error(error);return}
 products=data||[];renderProducts();
}
async function refreshAdmin(){
 const {data,error}=await client.from("products").select("*").order("created_at",{ascending:false});
 if(error){$("adminHint").textContent=error.message;return}
 $("adminProducts").innerHTML=(data||[]).map(p=>`<div class="admin-row"><img src="${safe(p.image_url||"https://placehold.co/100x100")}" alt=""><div class="grow"><strong>${safe(p.name)}</strong><small>${money(p.price)} · ${safe(p.category||"بێ بەش")} · ${p.published?"بڵاوکراوەتەوە":"شاراوە"}</small></div><button data-edit="${safe(p.id)}">دەستکاری</button><button data-publish="${safe(p.id)}" data-value="${p.published?"false":"true"}">${p.published?"شاردنەوە":"بڵاوکردنەوە"}</button><button data-delete="${safe(p.id)}">سڕینەوە</button></div>`).join("")||"<p>هێشتا کاڵایەک نییە.</p>";
}
async function checkSession(){
 if(!client)return;
 const {data}=await client.auth.getSession();
 isOwner=!!data.session && data.session.user.email?.toLowerCase()===OWNER_EMAIL.toLowerCase();
 if(isOwner){$("loginModal").classList.add("hidden");$("adminModal").classList.remove("hidden");await refreshAdmin()}
}
$("year").textContent=new Date().getFullYear();
$("search").addEventListener("input",renderProducts);
$("ownerBtn").onclick=()=>{if(isOwner){$("adminModal").classList.remove("hidden");refreshAdmin()}else $("loginModal").classList.remove("hidden")};
document.querySelectorAll("[data-close]").forEach(b=>b.onclick=()=>$(b.dataset.close).classList.add("hidden"));
$("loginBtn").onclick=async()=>{
 if(!client){$("loginHint").textContent="سەرەتا Supabase URL و anon key لە app.js دابنێ.";return}
 const email=$("loginEmail").value.trim(),password=$("loginPassword").value;
 if(email.toLowerCase()!==OWNER_EMAIL.toLowerCase()){$("loginHint").textContent="ئەم ئیمەیڵە مافی Owner نییە.";return}
 const {error}=await client.auth.signInWithPassword({email,password});
 if(error){$("loginHint").textContent="چوونەژوورەوە سەرکەوتوو نەبوو: "+error.message;return}
 isOwner=true;$("loginModal").classList.add("hidden");$("adminModal").classList.remove("hidden");await refreshAdmin();
};
$("logoutBtn").onclick=async()=>{if(client)await client.auth.signOut();isOwner=false;$("adminModal").classList.add("hidden")};
$("productForm").onsubmit=async e=>{
 e.preventDefault();if(!client||!isOwner)return;
 const id=$("productId").value;
 const item={name:$("pName").value.trim(),price:Number($("pPrice").value),category:$("pCategory").value.trim(),image_url:$("pImage").value.trim(),description:$("pDescription").value.trim(),published:true};
 const result=id?await client.from("products").update(item).eq("id",id):await client.from("products").insert(item);
 if(result.error){$("adminHint").textContent="هەڵە: "+result.error.message;return}
 $("adminHint").textContent="کاڵاکە پاشەکەوت کرا و لە پەڕەی کڕیاران نوێ دەبێتەوە.";
 $("productForm").reset();$("productId").value="";await refreshAdmin();await loadProducts();
};
$("resetForm").onclick=()=>{$("productForm").reset();$("productId").value=""};
$("adminProducts").onclick=async e=>{
 const edit=e.target.dataset.edit,del=e.target.dataset.delete,pub=e.target.dataset.publish,pubValue=e.target.dataset.value;
 if(edit){const {data,error}=await client.from("products").select("*").eq("id",edit).single();if(error)return; $("productId").value=data.id;$("pName").value=data.name;$("pPrice").value=data.price;$("pCategory").value=data.category||"";$("pImage").value=data.image_url||"";$("pDescription").value=data.description||"";return}
 if(del){if(!confirm("دڵنیایت لە سڕینەوەی ئەم کاڵایە؟"))return;const {error}=await client.from("products").delete().eq("id",del);if(error)$("adminHint").textContent=error.message;await refreshAdmin();await loadProducts();return}
 if(pub){const {error}=await client.from("products").update({published:pubValue==="true"}).eq("id",pub);if(error){$("adminHint").textContent=error.message;return}await refreshAdmin();await loadProducts()}
};
loadProducts();if(client){client.auth.onAuthStateChange(()=>checkSession());checkSession()}
