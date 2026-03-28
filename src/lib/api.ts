/**
 * A wrapper around the global fetch API to automatically include 
 * the Authorization bearer token from localStorage.
 */
export async function fetchWithAuth(url: string, options: RequestInit = {}) {
  const token = typeof window !== 'undefined' ? localStorage.getItem('access_token') : null;
  
  const headers = new Headers(options.headers || {});
  
  // Default to JSON content type for methods with bodies
  if (!headers.has('Content-Type') && options.body && !(options.body instanceof FormData)) {
    headers.set('Content-Type', 'application/json');
  }

  if (token && !headers.has('Authorization')) {
    headers.set('Authorization', `Bearer ${token}`);
  }
  
  const response = await fetch(url, {
    ...options,
    headers,
  });
  
  if (response.status === 401) {
    // Optional: Handle token expiration (e.g., redirect to login)
    console.error("Token expired or unauthorized");
    if (typeof window !== 'undefined') {
       localStorage.removeItem('access_token');
       localStorage.removeItem('user');
       // window.location.href = '/login'; 
    }
  }
  
  return response;
}
