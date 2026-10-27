/** @type {import('next').NextConfig} */
const nextConfig={
 async headers(){return [
 {source:'/sequence/:version([a-f0-9]{12})/:file*',headers:[{key:'Cache-Control',value:'public, max-age=31536000, immutable'}]},
 {source:'/hero/:version([a-f0-9]{12})/:file*',headers:[{key:'Cache-Control',value:'public, max-age=31536000, immutable'}]},
 ];},
};
export default nextConfig;
