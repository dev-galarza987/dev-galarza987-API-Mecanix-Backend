const http = require('http');

function request(path, method, data) {
    return new Promise((resolve, reject) => {
        const options = {
            hostname: 'localhost',
            port: 4000,
            path: '/api/v1' + path,
            method: method,
            headers: {
                'Content-Type': 'application/json',
            }
        };

        if (data) {
            options.headers['Content-Length'] = Buffer.byteLength(JSON.stringify(data));
        }

        const req = http.request(options, (res) => {
            let body = '';
            res.setEncoding('utf8');
            res.on('data', (chunk) => body += chunk);
            res.on('end', () => {
                try {
                    resolve({ status: res.statusCode, body: JSON.parse(body) });
                } catch (e) {
                    resolve({ status: res.statusCode, body: body });
                }
            });
        });

        req.on('error', (e) => reject(e));

        if (data) {
            req.write(JSON.stringify(data));
        }
        req.end();
    });
}

async function run() {
    const timestamp = Date.now();

    // Test Admin Login
    console.log('=== ADMIN LOGIN ===');
    const adminRes = await request('/auth/signin', 'POST', {
        email: 'admin@mecanix.com',
        password: 'adminpassword123'
    });
    console.log('Status:', adminRes.status);
    console.log('Token present:', !!adminRes.body.access_token);
    console.log('Role:', adminRes.body.user?.role);

    // Test Client Registration
    console.log('\n=== CLIENT REGISTRATION ===');
    const clientData = {
        role: 'client',
        code: Math.floor(Math.random() * 100000),
        name: 'TestClient',
        lastname: 'TestLastname',
        phone: '7' + Math.floor(Math.random() * 10000000),
        ci: Math.floor(Math.random() * 10000000),
        gender: 'male',
        email: `client${timestamp}@test.com`,
        password: 'Password123!',
        preferredContactMethod: 'email'
    };
    const regClientRes = await request('/auth/signup', 'POST', clientData);
    console.log('Status:', regClientRes.status);
    if (regClientRes.status !== 201) {
        console.log('Error:', JSON.stringify(regClientRes.body, null, 2));
    }

    // Test Client Login
    console.log('\n=== CLIENT LOGIN ===');
    const loginClientRes = await request('/auth/signin', 'POST', {
        email: clientData.email,
        password: clientData.password
    });
    console.log('Status:', loginClientRes.status);
    console.log('Token present:', !!loginClientRes.body.access_token);
    console.log('Role:', loginClientRes.body.user?.role);

    // Test Mechanic Registration (simple version without all required fields)
    console.log('\n=== MECHANIC REGISTRATION (Simple) ===');
    const mechanicData = {
        role: 'mechanic',
        employeeCode: `MEC${timestamp}`,
        firstName: 'TestMechanic',
        lastName: 'TestLastname',
        hireDate: '2025-01-01',
        password: 'Password123!',
    };
    const regMechanicRes = await request('/auth/signup', 'POST', mechanicData);
    console.log('Status:', regMechanicRes.status);
    if (regMechanicRes.status !== 201) {
        console.log('Error:', JSON.stringify(regMechanicRes.body, null, 2));
    } else {
        console.log('Success! Mechanic ID:', regMechanicRes.body.id);

        // Test Mechanic Login
        console.log('\n=== MECHANIC LOGIN ===');
        const loginMechanicRes = await request('/auth/signin', 'POST', {
            email: mechanicData.employeeCode,
            password: mechanicData.password
        });
        console.log('Status:', loginMechanicRes.status);
        console.log('Token present:', !!loginMechanicRes.body.access_token);
        console.log('Role:', loginMechanicRes.body.user?.role);
    }
}

run().catch(console.error);
