// auth.js

// --- Supabase Configuration ---
// IMPORTANT: Replace with your actual Supabase Project URL and Anon Key
const supabaseUrl = 'YOUR_SUPABASE_URL'; // <-- اینجا آدرس پروژه سوپابیس خود را قرار دهید
const supabaseKey = 'YOUR_SUPABASE_ANON_KEY'; // <-- اینجا کلید عمومی (Anon Key) پروژه خود را قرار دهید

// --- Initialize Supabase Client ---
// Create a single Supabase client for the entire app
const supabase = supabaseUrl && supabaseKey ? supabase.createClient(supabaseUrl, supabaseKey) : null;

// --- DOM Elements ---
const loginForm = document.getElementById('login-form');
const registerForm = document.getElementById('register-form');
const authMessage = document.getElementById('auth-message');
const logoutButton = document.getElementById('logout-button');

// --- Helper function to display messages ---
function showMessage(message, isError = false) {
    if (authMessage) {
        authMessage.textContent = message;
        authMessage.style.color = isError ? '#ff5566' : '#55ffaa';
    }
}

// --- Event Listener for Registration Form ---
if (registerForm) {
    registerForm.addEventListener('submit', async (event) => {
        event.preventDefault();
        if (!supabase) return showMessage('Supabase client not configured.', true);

        const email = document.getElementById('register-email').value;
        const password = document.getElementById('register-password').value;

        showMessage('در حال ثبت نام...', false);

        const { data, error } = await supabase.auth.signUp({
            email: email,
            password: password,
        });

        if (error) {
            showMessage(`خطا: ${error.message}`, true);
        } else if (data.user && data.user.identities.length === 0) {
            showMessage('این ایمیل قبلا ثبت شده است. لطفا وارد شوید.', true);
        } else if (data.user) {
            showMessage('ثبت نام موفقیت آمیز بود! لطفا ایمیل خود را برای تایید حساب کاربری چک کنید.', false);
            registerForm.reset();
        } else {
             showMessage('ثبت نام موفقیت آمیز بود! لطفا وارد شوید', false);
        }
    });
}

// --- Event Listener for Login Form ---
if (loginForm) {
    loginForm.addEventListener('submit', async (event) => {
        event.preventDefault();
        if (!supabase) return showMessage('Supabase client not configured.', true);

        const email = document.getElementById('login-email').value;
        const password = document.getElementById('login-password').value;
        
        showMessage('در حال ورود...', false);

        const { data, error } = await supabase.auth.signInWithPassword({
            email: email,
            password: password,
        });

        if (error) {
            showMessage(`خطا: ${error.message}`, true);
        } else {
            showMessage('ورود موفقیت آمیز بود! در حال انتقال...', false);
            window.location.href = 'index.html'; // Redirect to main page on successful login
        }
    });
}

// --- Event Listener for Logout Button ---
if (logoutButton) {
    logoutButton.addEventListener('click', async () => {
        if (!supabase) return;
        await supabase.auth.signOut();
        window.location.reload(); // Reload the page to update UI
    });
}

// --- Function to check user session on page load ---
async function checkUserSession() {
    if (!supabase) return;
    
    const { data: { session } } = await supabase.auth.getSession();
    const userInfoDiv = document.getElementById('user-info');
    const authActionsDiv = document.getElementById('auth-actions');
    
    if (userInfoDiv && authActionsDiv) {
        if (session) {
            // User is logged in
            authActionsDiv.style.display = 'none';
            userInfoDiv.style.display = 'flex';
            const userEmailSpan = document.getElementById('user-email');
            userEmailSpan.textContent = session.user.email;
        } else {
            // User is not logged in
            authActionsDiv.style.display = 'flex';
            userInfoDiv.style.display = 'none';
        }
    }
}

// --- Run session check when the page loads ---
// This is mainly for the index.html page
document.addEventListener('DOMContentLoaded', () => {
    if (document.getElementById('user-info')) { // Only run this on the main page
        checkUserSession();
    }
    if (!supabase) {
        console.error("Supabase is not configured. Please check your URL and Key in auth.js");
        const container = document.querySelector('.container');
        if (container) {
            const errorDiv = document.createElement('div');
            errorDiv.textContent = 'پیکربندی Supabase انجام نشده است. لطفا فایل auth.js را بررسی کنید.';
            errorDiv.style.color = 'yellow';
            errorDiv.style.marginTop = '20px';
            errorDiv.style.background = 'rgba(255,0,0,0.3)';
            errorDiv.style.padding = '10px';
            errorDiv.style.borderRadius = '8px';
            container.appendChild(errorDiv);
        }
    }
});
