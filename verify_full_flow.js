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

    // 1. Register Client
    console.log('--- Register Client ---');
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
    // console.log('Body:', regClientRes.body);

    // 2. Login Client
    console.log('\n--- Login Client ---');
    const loginClientRes = await request('/auth/signin', 'POST', {
        email: clientData.email,
        password: clientData.password
    });
    console.log('Status:', loginClientRes.status);
    console.log('Token present:', !!loginClientRes.body.access_token);
    console.log('Role:', loginClientRes.body.user?.role);

    // 3. Register Mechanic
    console.log('\n--- Register Mechanic ---');
    const mechanicData = {
        role: 'mechanic',
        employeeCode: `M${timestamp}`,
        firstName: 'TestMechanic',
        lastName: 'TestLastname',
        phone: '6' + Math.floor(Math.random() * 10000000),
        hireDate: '2025-01-01',
        password: 'Password123!',
        // Mechanic doesn't have email column in entity, but AuthService uses employeeCode as email/username?
        // Wait, AuthService.validateUser checks:
        // const mechanic = await this.mechanicRepository.findOne({ where: { employeeCode: email } });
        // So for Mechanic, "email" in login is actually employeeCode.
        // But registerDto has "password".
        // And Mechanic entity has "password".
    };
    const regMechanicRes = await request('/auth/signup', 'POST', mechanicData);
    console.log('Status:', regMechanicRes.status);
    // console.log('Body:', regMechanicRes.body);

    // 4. Login Mechanic
    console.log('\n--- Login Mechanic ---');
    const loginMechanicRes = await request('/auth/signin', 'POST', {
        email: mechanicData.employeeCode, // Using employeeCode as "email"
        password: mechanicData.password
    });
    console.log('Status:', loginMechanicRes.status);
    console.log('Token present:', !!loginMechanicRes.body.access_token);
    // console.log('Body:', loginMechanicRes.body);
}

run().catch(console.error);
