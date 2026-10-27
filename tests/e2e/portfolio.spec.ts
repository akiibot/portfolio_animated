import {test,expect} from '@playwright/test';
test('server renders content and local resume without animation dependencies',async({page})=>{
 await page.emulateMedia({reducedMotion:'reduce'});let frames=0;page.on('request',r=>{if(r.url().includes('/sequence/'))frames++});await page.goto('/');await expect(page.getByRole('heading',{level:1})).toContainText('Akib');await expect(page.getByRole('heading',{name:'Selected work.'})).toBeVisible();await expect(page.getByRole('link',{name:'View resume',exact:true}).first()).toHaveAttribute('href',/\/resume\/.*\.pdf/);expect(frames).toBe(0);
});
test('has accessible mobile navigation, no horizontal overflow, and working project routes',async({page})=>{
 await page.goto('/');await expect(page.getByRole('navigation',{name:'Main navigation'})).toBeVisible();await page.getByRole('link',{name:'Work',exact:true}).first().click();await expect(page).toHaveURL(/#projects$/);expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth)).toBe(true);await page.goto('/projects/find-my-paw');await expect(page.getByRole('heading',{level:1})).toContainText('Find My Paw');await page.goto('/projects/not-a-project');await expect(page.getByRole('heading',{name:'Page not found.'})).toBeVisible();
});
test('success resets contact form and never shows both success and failure',async({page})=>{
 await page.route('https://api.web3forms.com/submit',r=>r.fulfill({json:{success:true}}));await page.goto('/#contact');await page.getByLabel('Name',{exact:true}).fill('Portfolio test');await page.getByLabel('Email',{exact:true}).fill('test@example.com');await page.getByLabel('Message',{exact:true}).fill('Mocked contact test');await page.getByRole('button',{name:/^Send message$/i}).click();await expect(page.getByRole('status')).toContainText('Message sent');await expect(page.getByLabel('Name',{exact:true})).toHaveValue('');await expect(page.getByRole('alert')).toHaveCount(0);
});
test('provider failure retains message and allows retry',async({page})=>{
 await page.route('https://api.web3forms.com/submit',r=>r.fulfill({status:500,body:'not json'}));await page.goto('/#contact');await page.getByLabel('Name',{exact:true}).fill('Test');await page.getByLabel('Email',{exact:true}).fill('test@example.com');await page.getByLabel('Message',{exact:true}).fill('Keep this message');await page.getByRole('button',{name:/^Send message$/i}).click();await expect(page.getByRole('alert')).toBeVisible();await expect(page.getByLabel('Message',{exact:true})).toHaveValue('Keep this message');await expect(page.getByRole('button',{name:/^Send message$/i})).toBeEnabled();
});
test('versioned assets are immutable but HTML is not',async({request})=>{
 const html=await request.get('/');const text=await html.text();const poster=text.match(/\/hero\/[a-f0-9]{12}\/poster\.png/);expect(poster).not.toBeNull();const image=await request.get(poster![0]);expect(image.headers()['cache-control']).toContain('immutable');expect(html.headers()['cache-control']||'').not.toContain('immutable');
});
