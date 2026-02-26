const r = async () => {
    const rnd = Math.random();
    const email = `test${rnd}@gmail.com`;
    const res1 = await fetch('http://localhost:8000/api/auth/register', {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({ name: 'testuser', email, password: 'password123' })
    });
    const text1 = await res1.text();
    console.log('REG:', text1);
    
    const res2 = await fetch('http://localhost:8000/api/auth/login', {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({ email, password: 'password123' })
    });
    const text2 = await res2.text();
    console.log('LOG:', text2);
    
    const token = JSON.parse(text2).token;
    
    const res3 = await fetch('http://localhost:8000/api/auth/admin/dashboard', {
        headers: { 'Authorization': `Bearer ${token}` }
    });
    const text3 = await res3.text();
    console.log('ADMIN DASHBOARD RES STATUS:', res3.status);
    console.log('ADMIN DASHBOARD RES:', text3);
};
r().catch(console.error);
