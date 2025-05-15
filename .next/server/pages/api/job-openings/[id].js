"use strict";(()=>{var e={};e.id=82,e.ids=[82],e.modules={8432:e=>{e.exports=require("bcryptjs")},145:e=>{e.exports=require("next/dist/compiled/next-server/pages-api.runtime.prod.js")},661:e=>{e.exports=require("sqlite3")},2048:e=>{e.exports=require("fs")},5315:e=>{e.exports=require("path")},7360:e=>{e.exports=require("url")},8887:e=>{e.exports=import("sqlite")},6249:(e,t)=>{Object.defineProperty(t,"l",{enumerable:!0,get:function(){return function e(t,a){return a in t?t[a]:"then"in t&&"function"==typeof t.then?t.then(t=>e(t,a)):"function"==typeof t&&"default"===a?t:void 0}}})},2125:(e,t,a)=>{a.r(t),a.d(t,{config:()=>d,default:()=>l,routeModule:()=>u});var i={};a.r(i),a.d(i,{default:()=>c});var n=a(1802),o=a(7153),r=a(6249),s=a(2250);async function c(e,t){try{let a=await (0,s.VK)(),{id:i}=e.query;if(!i)return t.status(400).json({message:"Job opening ID is required"});if("GET"===e.method){let e=await a.get("SELECT * FROM job_openings WHERE id = ?",[i]);if(!e)return t.status(404).json({message:"Job opening not found"});return t.status(200).json(e)}return t.status(405).json({message:"Method not allowed"})}catch(e){return console.error("Error handling job opening:",e),t.status(500).json({message:"Internal server error"})}}let l=(0,r.l)(i,"default"),d=(0,r.l)(i,"config"),u=new n.PagesAPIRouteModule({definition:{kind:o.x.PAGES_API,page:"/api/job-openings/[id]",pathname:"/api/job-openings/[id]",bundlePath:"",filename:""},userland:i})},2250:(e,t,a)=>{a.d(t,{VK:()=>s,u1:()=>o});let i=async()=>{try{let e=await Promise.resolve().then(a.t.bind(a,2048,23)),t=(await Promise.resolve().then(a.t.bind(a,5315,23))).join(process.cwd(),"data.db");return e.existsSync(t)}catch(e){return console.error("Error checking if DB file exists:",e),!1}},n=!0;async function o(){try{let e=await i(),{open:t}=await Promise.resolve().then(a.bind(a,8887)),o=await Promise.resolve().then(a.t.bind(a,661,23)),s=await Promise.resolve().then(a.t.bind(a,8432,23)),c=await Promise.resolve().then(a.t.bind(a,5315,23)),l=await Promise.resolve().then(a.t.bind(a,7360,23));await Promise.resolve().then(a.t.bind(a,2048,23));let d=l.fileURLToPath("file:///home/user456/Documents/project-main-1/src/lib/db.ts");c.dirname(d);let u=c.join(process.cwd(),"data.db");console.log("Initializing database at:",u);let p=await t({filename:u,driver:o.default.Database});console.log("Connected to database"),await p.exec(`
      CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        username TEXT UNIQUE NOT NULL,
        password TEXT NOT NULL,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
      );

      CREATE TABLE IF NOT EXISTS categories (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT UNIQUE NOT NULL,
        description TEXT,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
      );

      CREATE TABLE IF NOT EXISTS products (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        description TEXT,
        image TEXT,
        specs TEXT,
        useCases TEXT,
        category TEXT,
        images TEXT,
        document TEXT,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (category) REFERENCES categories(name)
      );
      
      CREATE TABLE IF NOT EXISTS job_openings (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        title TEXT NOT NULL,
        department TEXT NOT NULL,
        location TEXT NOT NULL,
        type TEXT NOT NULL,
        description TEXT NOT NULL,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        active INTEGER DEFAULT 1
      );
    `),console.log("Database tables created");try{(await p.all("PRAGMA table_info(products)")).some(e=>"document"===e.name)||(await p.exec("ALTER TABLE products ADD COLUMN document TEXT"),console.log("Added document column to products table"))}catch(e){console.error("Error altering products table:",e)}if(!await p.get("SELECT * FROM users WHERE username = ?",["admin"])){let e=await s.hash("Azerbaycan123",10);await p.run("INSERT INTO users (username, password) VALUES (?, ?)",["admin",e]),console.log("Admin user created")}let E=await p.get("SELECT COUNT(*) as count FROM categories");if(0===E.count)for(let e of[{name:"Industrial Equipment",description:"Heavy-duty industrial machinery and equipment"},{name:"Safety Gear",description:"Personal protective equipment and safety solutions"},{name:"Measurement Tools",description:"Precision measurement and testing instruments"},{name:"Fluid Control",description:"Valves, pumps, and fluid management systems"},{name:"Power Systems",description:"Power generation and electrical equipment"},{name:"Construction Equipment",description:"Tools and equipment for construction projects"}])await p.run("INSERT INTO categories (name, description) VALUES (?, ?)",[e.name,e.description]);let T=await p.get("SELECT COUNT(*) as count FROM products");if(0===T.count&&!e&&n)try{let e=await Promise.resolve().then(a.t.bind(a,2048,23)),t=(await Promise.resolve().then(a.t.bind(a,5315,23))).join(process.cwd(),"src","data","products.json"),i=[];if(e.existsSync(t)){let a=e.readFileSync(t,"utf8");i=JSON.parse(a),console.log("Loaded products from JSON file")}else i=[{id:1,name:"Sample Product",description:"A sample product created automatically",image:"https://placehold.co/600x400?text=Sample+Product",specs:["Sample specification 1","Sample specification 2"],useCases:["Sample use case 1","Sample use case 2"],category:"Sample Category"}],console.log("Using default product as fallback");for(let e of i)await p.run("INSERT INTO products (id, name, description, image, specs, useCases, category) VALUES (?, ?, ?, ?, ?, ?, ?)",[e.id,e.name,e.description,e.image,JSON.stringify(e.specs),JSON.stringify(e.useCases),e.category]);console.log(`${i.length} products inserted into database`)}catch(e){console.error("Error importing initial products:",e)}n=!1;let m=await p.get("SELECT COUNT(*) as count FROM job_openings");if(0===m.count){for(let e of[{title:"Supply Chain Manager",department:"operations",location:"Baku, Azerbaijan",type:"Full-time",description:"Leading and optimizing supply chain operations..."},{title:"Sales Representative",department:"sales",location:"Baku, Azerbaijan",type:"Full-time",description:"Developing and maintaining client relationships..."},{title:"Logistics Coordinator",department:"logistics",location:"Baku, Azerbaijan",type:"Full-time",description:"Coordinating shipment schedules and delivery routes..."}])await p.run("INSERT INTO job_openings (title, department, location, type, description) VALUES (?, ?, ?, ?, ?)",[e.title,e.department,e.location,e.type,e.description]);console.log("Default job openings created")}return r=p,p}catch(e){throw console.error("Database initialization error:",e),e}}let r=null;async function s(){return r||(r=await o()),r}},7153:(e,t)=>{var a;Object.defineProperty(t,"x",{enumerable:!0,get:function(){return a}}),function(e){e.PAGES="PAGES",e.PAGES_API="PAGES_API",e.APP_PAGE="APP_PAGE",e.APP_ROUTE="APP_ROUTE"}(a||(a={}))},1802:(e,t,a)=>{e.exports=a(145)}};var t=require("../../../webpack-api-runtime.js");t.C(e);var a=t(t.s=2125);module.exports=a})();