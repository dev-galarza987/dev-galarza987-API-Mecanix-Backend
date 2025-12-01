require('dotenv').config();
// Cofiguration
console.log('API_VERSION:', process.env.API_VERSION);
console.log('PORT:', process.env.PORT);

// ENVIRONMENT
console.log('DB_ENVIRONMENT:', process.env.DB_ENVIRONMENT, '\n');

// SUPABASE
console.log('DB_SUPABASE_HOST:', process.env.DB_SUPABASE_HOST);
console.log('DB_SUPABASE_PORT:', process.env.DB_SUPABASE_PORT);
console.log('DB_SUPABASE_USERNAME:', process.env.DB_SUPABASE_USERNAME);
console.log('DB_SUPABASE_PASSWORD:', process.env.DB_SUPABASE_PASSWORD);
console.log('DB_SUPABASE_DATABASE:', process.env.DB_SUPABASE_DATABASE, '\n');


// JWT
console.log('JWT_SECRET:', process.env.JWT_SECRET);
console.log('JWT_EXPIRATION:', process.env.JWT_EXPIRATION);
console.log('JWT_REFRESH_SECRET:', process.env.JWT_REFRESH_SECRET);
console.log('JWT_REFRESH_EXPIRATION:', process.env.JWT_REFRESH_EXPIRATION);