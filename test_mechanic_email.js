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
    console.log('=== TESTING MECHANIC WITH EMAIL ===\n');

    const timestamp = Date.now();

    // 1. Create mechanic with email
    console.log('--- Creating Mechanic with Email ---');
    const mechanicData = {
        employeeCode: `MECEMAIL${timestamp}`,
        firstName: 'Juan',
        lastName: 'Pérez',
        email: `mechanic${timestamp}@mecanix.com`,
        hireDate: '2025-01-01',
        password: 'Password123!',
    };

    const createRes = await request('/auth/mechanic/signup', 'POST', mechanicData);
    console.log('Status:', createRes.status);
    if (createRes.status === 201) {
        console.log('✅ Mechanic created successfully');
        console.log('Email:', mechanicData.email);
        console.log('Employee Code:', mechanicData.employeeCode);
    } else {
        console.log('❌ Error:', createRes.body);
    }

    // 2. Login with email
    console.log('\n--- Login with Email ---');
    const loginEmailRes = await request('/auth/mechanic/signin', 'POST', {
        email: mechanicData.email,
        password: mechanicData.password
    });
    console.log('Status:', loginEmailRes.status);
    if (loginEmailRes.status === 201) {
        console.log('✅ Login with email successful!');
        console.log('Token present:', !!loginEmailRes.body.access_token);
    } else {
        console.log('❌ Error:', loginEmailRes.body);
    }

    // 3. Login with employeeCode
    console.log('\n--- Login with Employee Code ---');
    const loginCodeRes = await request('/auth/mechanic/signin', 'POST', {
        email: mechanicData.employeeCode,
        password: mechanicData.password
    });
    console.log('Status:', loginCodeRes.status);
    if (loginCodeRes.status === 201) {
        console.log('✅ Login with employeeCode successful!');
        console.log('Token present:', !!loginCodeRes.body.access_token);
    } else {
        console.log('❌ Error:', loginCodeRes.body);
    }
}

run().catch(console.error);
