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
    console.log('=== TESTING DUPLICATE VALIDATION ===\n');

    // 1. Create a client
    console.log('--- Creating Client ---');
    const clientData = {
        code: 9999,
        name: 'TestDuplicate',
        lastname: 'User',
        phone: '71111111',
        ci: 99999999,
        gender: 'male',
        email: 'duplicate@test.com',
        password: 'Password123!',
        preferredContactMethod: 'email'
    };

    const createRes1 = await request('/auth/client/signup', 'POST', clientData);
    console.log('First attempt Status:', createRes1.status);
    if (createRes1.status === 201) {
        console.log('✅ Client created successfully');
    } else {
        console.log('❌ Error:', createRes1.body);
    }

    // 2. Try to create the same client again (should fail)
    console.log('\n--- Attempting to Create Duplicate Client ---');
    const createRes2 = await request('/auth/client/signup', 'POST', clientData);
    console.log('Second attempt Status:', createRes2.status);
    if (createRes2.status === 409) {
        console.log('✅ Duplicate validation working! Message:', createRes2.body.message);
    } else {
        console.log('❌ Expected 409, got:', createRes2.status);
    }

    // 3. Create a mechanic
    console.log('\n--- Creating Mechanic ---');
    const mechanicData = {
        employeeCode: 'DUPTEST001',
        firstName: 'TestDuplicate',
        lastName: 'Mechanic',
        hireDate: '2025-01-01',
        password: 'Password123!',
    };

    const createMechRes1 = await request('/auth/mechanic/signup', 'POST', mechanicData);
    console.log('First attempt Status:', createMechRes1.status);
    if (createMechRes1.status === 201) {
        console.log('✅ Mechanic created successfully');
    } else {
        console.log('❌ Error:', createMechRes1.body);
    }

    // 4. Try to create the same mechanic again (should fail)
    console.log('\n--- Attempting to Create Duplicate Mechanic ---');
    const createMechRes2 = await request('/auth/mechanic/signup', 'POST', mechanicData);
    console.log('Second attempt Status:', createMechRes2.status);
    if (createMechRes2.status === 409) {
        console.log('✅ Duplicate validation working! Message:', createMechRes2.body.message);
    } else {
        console.log('❌ Expected 409, got:', createMechRes2.status);
    }

    // 5. Test login with new credentials
    console.log('\n--- Testing Login with New Credentials ---');
    const loginClientRes = await request('/auth/client/signin', 'POST', {
        email: clientData.email,
        password: clientData.password
    });
    console.log('Client login Status:', loginClientRes.status);
    console.log('Token present:', !!loginClientRes.body.access_token);

    const loginMechRes = await request('/auth/mechanic/signin', 'POST', {
        email: mechanicData.employeeCode,
        password: mechanicData.password
    });
    console.log('Mechanic login Status:', loginMechRes.status);
    console.log('Token present:', !!loginMechRes.body.access_token);
}

run().catch(console.error);
