# Code Area: Login, Registration, and Roles

This lesson follows a person from the login form to a protected staff page.

## The full login journey

```text
Login form
-> AuthContext
-> csrfFetch
-> POST /api/auth/login
-> AuthController
-> Laravel session
-> user JSON returns
-> React saves user
-> Navbar changes
```

## 1. `resources/js/lib/api.js`

This helper sends browser requests to Laravel.

### Real code: function start

```js
export async function csrfFetch(url, options = {}) {
```

**What it says:** Create a reusable waiting function named `csrfFetch`. It receives an address and optional settings.

**Why it is there:** Login, logout, orders, payments, and staff requests should use the same safe rules.

**If you delete it:** Every caller importing `csrfFetch` fails. You would need to rewrite request code everywhere.

`export` lets other files import the function. `async` lets it use `await`.

### Real code: read the CSRF token

```js
const csrfToken = document
    .querySelector('meta[name="csrf-token"]')
    ?.getAttribute('content');
```

**What it says:** Find the CSRF meta tag in the HTML and read its secret value.

**Why it is there:** Laravel checks this secret stamp on requests that change data.

**If you delete it:** POST, PATCH, registration, login, and logout may be rejected with a CSRF error.

`?.` means “continue only if the item exists.” It prevents a crash when the tag is missing.

### Real code: request headers

```js
const headers = {
    Accept: 'application/json',
    'Content-Type': 'application/json',
    'X-Requested-With': 'XMLHttpRequest',
    ...options.headers,
};
```

**What it says:** Tell Laravel we want JSON, we are sending JSON, and this is a browser JavaScript request. Add any extra caller headers.

**Why it is there:** Laravel can return JSON errors instead of an HTML error page. Payment can add `Idempotency-Key`.

**If you delete it:** Laravel may not parse the body as expected. Errors may return in an unexpected format.

The three dots in `...options.headers` copy extra values into this object.

### Real code: add CSRF header

```js
if (csrfToken) {
    headers['X-CSRF-TOKEN'] = csrfToken;
}
```

**What it says:** If a token exists, place it in the request headers.

**Why it is there:** Laravel's CSRF check looks for this header.

**If you delete it:** Safe-changing requests can fail.

### Real code: send request

```js
const response = await fetch(url, {
    credentials: 'same-origin',
    ...options,
    headers,
});
```

**What it says:** Send the request and wait. Include cookies when frontend and backend use the same website address.

**Why it is there:** The session cookie tells Laravel which user is logged in.

**If you delete `credentials`:** Same-origin fetch normally sends same-origin cookies, but writing it clearly protects the intended behavior and documents the rule.

**If you delete the whole block:** No request is sent.

### Real code: read JSON

```js
const contentType = response.headers.get('content-type') || '';
const isJson = contentType.includes('application/json');
const payload = isJson ? await response.json() : null;
```

**What it says:** Check whether the answer is JSON. Parse it only when it is.

**Why it is there:** Trying to parse an empty or HTML answer as JSON causes another error.

**If you delete the check:** Some server errors can make the helper crash while reading the answer.

### Real code: update changed CSRF token

```js
if (payload?.csrf_token) {
    document.querySelector('meta[name="csrf-token"]')
        ?.setAttribute('content', payload.csrf_token);
}
```

**What it says:** If Laravel sends a fresh CSRF token after login/logout, replace the old token in the page.

**Why it is there:** Laravel changes session security values after identity changes.

**If you delete it:** A later request may use an old token and fail.

### Real code: errors and success

```js
if (!response.ok) {
    const message = payload?.message || 'Something went wrong. Please try again.';
    const error = new Error(message);
    error.payload = payload;
    throw error;
}

return payload;
```

**What it says:** Turn failed HTTP answers into JavaScript errors. Keep Laravel's full error data. Return good data.

**Why it is there:** Pages can use `try/catch` and show a useful message.

**If you delete it:** A failed login could look like success because fetch itself does not throw for every 400/500 answer.

## 2. `resources/js/context/AuthContext.jsx`

This file gives the whole React app one shared logged-in user.

### Real code: context and state

```jsx
const AuthContext = createContext(null);

export function AuthProvider({ children }) {
    const [user, setUser] = useState(() => window.__AUTH_USER__ || null);
    const [isCheckingAuth, setIsCheckingAuth] = useState(true);
    const authRequestVersion = useRef(0);
```

**What it says:** Create a shared channel. Remember the user, whether startup checking is happening, and a request version number.

**Why it is there:** Navbar, Login, and StaffDashboard must agree about the current user.

**If you delete `user`:** React cannot show logged-in state.

**If you delete `isCheckingAuth`:** Navbar may briefly show Login before the saved session is checked.

**If you delete the version ref:** A slow old startup request might overwrite a newer login result.

`children` means all React components placed inside AuthProvider.

### Real code: check current session

```jsx
useEffect(() => {
    let isMounted = true;
    const requestVersion = authRequestVersion.current;

    csrfFetch('/api/auth/me')
        .then((response) => {
            if (isMounted && requestVersion === authRequestVersion.current) {
                setUser(response.user || null);
            }
        })
        .catch(() => {
            if (isMounted && requestVersion === authRequestVersion.current) setUser(null);
        })
        .finally(() => {
            if (isMounted) setIsCheckingAuth(false);
        });

    return () => {
        isMounted = false;
    };
}, []);
```

**What it says:** Once when AuthProvider starts, ask Laravel who is logged in. Save the user or null. Mark checking finished. Stop updates after unmount.

**Why it is there:** Refreshing the page clears React memory, but the Laravel session cookie may still be valid.

**If you delete this effect:** A refresh forgets the logged-in user in the UI until another login.

The empty `[]` means run once after the first display.

### Real code: login

```jsx
login: async (credentials) => {
    authRequestVersion.current += 1;
    const response = await csrfFetch('/api/auth/login', {
        method: 'POST',
        body: JSON.stringify(credentials),
    });
    flushSync(() => {
        setUser(response.user);
        setIsCheckingAuth(false);
    });
    return response.user;
},
```

**What it says:** Start a newer auth request, send credentials, immediately save the returned user, and return that user to Login.

**Why it is there:** Navbar must change without a full page refresh. Login also needs the role for redirect.

**If you delete `setUser`:** Login can succeed on Laravel, but the visible Navbar still looks logged out.

`flushSync` asks React to finish this update immediately before navigation. It is an advanced tool. Normal state updates are better unless timing truly matters.

### Register and logout

`register` follows the same pattern using `/api/auth/register`.

`logout` calls `/api/auth/logout`, then sets user to null.

If logout did not clear user, the Navbar would still show the old account until refresh.

### Real code: share the value

```jsx
return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
```

**What it says:** Give the auth value to every child component.

**Why it is there:** `useAuth()` can read the shared data anywhere below it.

**If you delete it:** `useAuth()` has no provider and throws an error.

## 3. `resources/js/Pages/Auth/Login.jsx`

### Real code: form memory

```jsx
const [form, setForm] = useState({
    email: '',
    password: '',
    remember: false,
});
const [error, setError] = useState('');
const [isSubmitting, setIsSubmitting] = useState(false);
```

**What it says:** Remember three input values, an error message, and whether login is running.

**Why it is there:** React controls the form and can disable the button during a request.

**If you delete form state:** Inputs no longer work as controlled React fields.

### Real code: update one field

```jsx
const updateField = (field, value) => {
    setForm((current) => ({
        ...current,
        [field]: value,
    }));
};
```

**What it says:** Copy the current form and change one named field.

**Why it is there:** Typing email should not erase password or remember choice.

**If you replace it with only `{ [field]: value }`:** Other form values disappear.

### Real code: submit

```jsx
const submitLogin = async (event) => {
    event.preventDefault();
    setError('');
    setIsSubmitting(true);

    try {
        const user = await login(form);
        navigate(['staff', 'admin'].includes(user.role) ? '/staff' : '/menu', { replace: true });
    } catch (requestError) {
        setError(requestError.message);
    } finally {
        setIsSubmitting(false);
    }
};
```

**What it says:** Stop normal page reload, clear old error, lock button, try login, redirect by role, show errors, then unlock.

**Why it is there:** This is the complete form action.

**If you delete `preventDefault`:** The browser reloads the page like an old HTML form.

**If you delete the role choice:** Staff no longer go directly to the dashboard.

**If you delete `finally`:** The button can stay stuck after success or failure.

The JSX below uses React Bootstrap `Form`, `Form.Group`, `Form.Label`, and `Form.Control`. Labels and matching control IDs help keyboard and screen-reader users.

## 4. `resources/js/Pages/Auth/Register.jsx`

Register repeats the same safe form pattern.

### Real code: registration fields

```jsx
const [form, setForm] = useState({
    name: '',
    email: '',
    password: '',
    password_confirmation: '',
});
```

**What it says:** Remember name, email, password, and repeated password.

**Why it is there:** Laravel's `confirmed` password rule looks for `password_confirmation`.

**If you rename that field only in React:** Laravel says password confirmation does not match or is missing.

After success, it calls `navigate('/menu')` because new registrations are normal customers.

## 5. Auth routes in `routes/web.php`

```php
Route::get('/auth/me', [AuthController::class, 'me']);
Route::post('/auth/login', [AuthController::class, 'login']);
Route::post('/auth/register', [AuthController::class, 'register']);
Route::post('/auth/logout', [AuthController::class, 'logout']);
```

- `me` reads current login.
- `login` checks credentials.
- `register` creates a user.
- `logout` destroys the session.

Delete one route and its matching browser action receives a not-found response.

## 6. `app/Http/Controllers/Api/AuthController.php`

### Imports and class

The `namespace` line gives the class its full PHP address.

`use` lines bring in Controller, User, Request, Auth, password rules, and exceptions.

`class AuthController extends Controller` creates the auth controller from the shared controller parent.

Deleting a needed import makes its short class name unknown.

### Real code: current user

```php
public function me(Request $request): JsonResponse
{
    return response()->json([
        'user' => $request->user(),
    ], $request->user() ? 200 : 401);
}
```

**What it says:** Return the current user. Use status 200 if present or 401 if not logged in.

**Why it is there:** AuthContext restores session state after refresh.

**If you delete it:** The initial auth check has no endpoint.

### Real code: registration validation

```php
$data = $request->validate([
    'name' => ['required', 'string', 'min:2', 'max:80'],
    'email' => ['required', 'email', 'max:160', 'unique:users,email'],
    'password' => ['required', 'confirmed', Password::min(8)],
]);
```

**What it says:** Require a sensible name, unique email, and confirmed password with at least eight characters.

**Why it is there:** Bad or duplicate account information must not be saved.

**If you delete it:** Unsafe or incomplete data can reach user creation.

### Real code: create and log in

```php
$user = User::create($data);
Auth::login($user);
$request->session()->regenerate();
```

**What it says:** Save the user, log them in, and replace the old session ID.

**Why it is there:** Registration should enter the account immediately. Regeneration prevents a session-fixation attack.

**If you delete regeneration:** Login may still work, but a security protection is missing.

### Real code: login attempt

```php
if (! Auth::attempt($credentials, $remember)) {
    throw ValidationException::withMessages([
        'email' => ['The provided credentials are incorrect.'],
    ]);
}
```

**What it says:** Ask Laravel to verify email/password. If it fails, return a safe validation message.

**Why it is there:** Password checking must use Laravel's secure hash comparison.

**If you delete this check:** You have no safe login decision.

The message does not reveal whether the email or password was wrong. That gives attackers less information.

### Real code: logout

```php
Auth::guard('web')->logout();
$request->session()->invalidate();
$request->session()->regenerateToken();
```

**What it says:** Remove login, destroy old session data, and make a new CSRF token.

**Why it is there:** Old login proof must stop working.

**If you delete invalidation:** Old session information may remain longer than intended.

## 7. `app/Models/User.php`

### Real code: allowed and hidden fields

```php
protected $fillable = ['name', 'email', 'password', 'role'];
protected $hidden = ['password', 'remember_token'];
```

**What it says:** These fields may be filled in bulk. Password and remember token must not appear in JSON.

**Why it is there:** It protects assignment and prevents secret hash output.

**If you remove password from hidden:** API user JSON can expose the password hash.

### Real code: casts

```php
protected function casts(): array
{
    return [
        'email_verified_at' => 'datetime',
        'password' => 'hashed',
    ];
}
```

**What it says:** Turn verification time into a date object and automatically hash assigned passwords.

**Why it is there:** Plain passwords must never be stored.

**If you delete the hashed cast without adding manual hashing:** New passwords could be stored incorrectly and insecurely.

### Real code: staff check

```php
public function isStaff(): bool
{
    return in_array($this->role, ['staff', 'admin'], true);
}
```

**What it says:** Return true only for staff or admin.

**Why it is there:** Broadcast channel security reuses one role rule.

**If you delete it:** `routes/channels.php` cannot call `$user->isStaff()`.

## 8. `app/Http/Middleware/RequireRole.php`

```php
public function handle(Request $request, Closure $next, string ...$roles): Response
{
    abort_unless($request->user() && in_array($request->user()->role, $roles, true), 403);

    return $next($request);
}
```

**What it says:** Get the current user and allowed role list. Stop with 403 unless the role matches. Otherwise continue.

**Why it is there:** Hiding the Staff link in React is not security. A person can type an API address manually.

**If you delete this middleware from staff routes:** Logged-in customers may reach staff operations.

`Closure $next` is the next checkpoint or controller.

## 9. `config/auth.php`

The important active block is:

```php
'guards' => [
    'web' => [
        'driver' => 'session',
        'provider' => 'users',
    ],
],
```

**What it says:** The `web` login system uses server sessions and finds users through the users provider.

**Why it is there:** Laravel needs to know how login proof and user lookup work.

**If you change the driver without setting up another system:** Login breaks.

The users provider points to `App\Models\User` through Eloquent.

Password reset settings choose the reset table, 60-minute expiry, and 60-second throttle.

## 10. `config/session.php`

Important values:

```php
'driver' => env('SESSION_DRIVER', 'database'),
'lifetime' => (int) env('SESSION_LIFETIME', 120),
'http_only' => env('SESSION_HTTP_ONLY', true),
'same_site' => env('SESSION_SAME_SITE', 'lax'),
```

- Database driver stores sessions in the `sessions` table.
- Lifetime is 120 idle minutes by default.
- HTTP-only stops JavaScript from reading the session cookie.
- SameSite Lax reduces unwanted cross-site cookie sending.

Deleting the whole config makes Laravel use missing or incorrect session settings. Changing cookie safety values carelessly weakens security.

## 11. Staff route protection

```php
Route::middleware(['auth', 'role:staff,admin'])->prefix('staff')->group(function () {
    Route::get('/orders', [StaffOrderController::class, 'index']);
});
```

**What it says:** Before staff routes, require login and staff/admin role.

**Why it is there:** Two doors are checked: “Who are you?” and “Are you allowed?”

**If you delete `auth`:** There may be no user for role checking.

**If you delete `role`:** Any logged-in customer can call staff endpoints.

## 12. Test proof

From `tests/Feature/OrderOperationsTest.php`:

```php
$this->getJson('/api/staff/orders')->assertUnauthorized();

$customer = User::factory()->create(['role' => 'customer']);
$this->actingAs($customer)->getJson('/api/staff/orders')->assertForbidden();

$staff = User::factory()->create(['role' => 'staff']);
$this->actingAs($staff)->getJson('/api/staff/orders')->assertOk();
```

**What it says:** Guest gets 401. Customer gets 403. Staff gets 200.

**Why it is there:** This automatically proves the security doors still work.

**If you delete the test:** Protection can break later without quick warning.

## Important truth about Sanctum

This project does **not** install Laravel Sanctum.

It uses the normal Laravel `web` session guard.

Do not say the project uses Sanctum in a presentation.

## What you should remember

- Laravel's session is the real login proof; React user state controls the visible screen.
- AuthContext makes all components update immediately after login or logout.
- CSRF protects cookie-based changing requests.
- Authentication asks who you are. Role middleware asks what you may do.
- Staff security must be enforced by Laravel, not only hidden in React.

## Test yourself

1. Why does AuthContext call `/api/auth/me` on startup?
2. What does `setUser(response.user)` change?
3. Why does Laravel regenerate the session after login?
4. What is the difference between 401 and 403 here?
5. Does this project use Sanctum?

## Answers

1. It restores the visible user from an existing Laravel session after refresh.
2. It makes Navbar and other auth-reading components rerender as logged in.
3. It protects against session fixation.
4. 401 means not logged in. 403 means logged in but not allowed.
5. No. It uses the normal session-based `web` guard.
