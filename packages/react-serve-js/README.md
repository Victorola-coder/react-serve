# ReactServe

> React-style backend framework for building APIs with JSX

ReactServe lets you build backend APIs using React-style JSX syntax. Define routes, handle requests, and send responses all within familiar JSX components.

## Installation

```bash
npx create-react-serve my-api
```

## Quick Start

```tsx
import {
  App,
  Route,
  RouteGroup,
  Middleware,
  Response,
  useRoute,
  useSetContext,
  useContext,
  serve,
  type MiddlewareFunction,
} from "react-serve-js";

// Example auth middleware
const authMiddleware: MiddlewareFunction = (req, next) => {
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) {
    return <Response status={401} json={{ error: "Unauthorized" }} />;
  }

  useSetContext("user", { id: 1, name: "User" });
  return next();
};

function Backend() {
  return (
    <App port={3000}>
      <Route path="/" method="GET">
        {async () => {
          return <Response json={{ message: "Hello World!" }} />;
        }}
      </Route>

      <RouteGroup prefix="/api">
        <Middleware use={authMiddleware} />

        <Route path="/users/:id" method="GET">
          {async () => {
            const { params } = useRoute();
            const user = useContext("user");
            return <Response json={{ userId: params.id, currentUser: user }} />;
          }}
        </Route>
      </RouteGroup>
    </App>
  );
}

serve(Backend());
```

## Components

### `<App>`

The root component that configures your server.

**Props:**

- `port?: number` - Port to run the server on (default: 9000)

### `<Route>`

Defines an API endpoint.

**Props:**

- `path: string` - URL path pattern (supports Express.js route parameters)
- `method: string` - HTTP method (GET, POST, PUT, DELETE, etc.)
- `children: () => Promise<ReactElement>` - Async function that handles the request

### `<Middleware>`

Executes middleware functions for request processing, authentication, logging, etc.

**Props:**

- `use: MiddlewareFunction` - The middleware function to execute

**Example:**

```tsx
import { type MiddlewareFunction } from "react-serve-js";

const authMiddleware: MiddlewareFunction = (req, next) => {
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) {
    return <Response status={401} json={{ error: "Unauthorized" }} />;
  }

  // Attach user data to request context
  useSetContext("user", { id: 1, name: "John" });

  return next(); // Continue to next middleware or route handler
};

<RouteGroup prefix="/api">
  <Middleware use={authMiddleware} />
  <Route path="/users" method="GET">
    {() => {
      const user = useContext("user");
      return <Response json={user} />;
    }}
  </Route>
</RouteGroup>;
```

### `<RouteGroup>`

Groups routes together with a shared path prefix.

**Props:**

- `prefix?: string` - Path prefix to apply to all child routes
- `children: ReactNode` - Child routes and route groups

**Example:**

```tsx
<RouteGroup prefix="/api">
  <Route path="/users" method="GET">
    {async () => <Response json={users} />}
  </Route>
  {/* This becomes /api/users */}

  <RouteGroup prefix="/v1">
    <Route path="/posts" method="GET">
      {async () => <Response json={posts} />}
    </Route>
    {/* This becomes /api/v1/posts */}
  </RouteGroup>
</RouteGroup>
```

### `<Response>`

Sends a response back to the client.

**Props:**

- `json?: any` - JSON data to send
- `status?: number` - HTTP status code (default: 200)

## Hooks

### `useRoute()`

Access request data within route handlers.

```tsx
const { params, query, body, req, res } = useRoute();
```

Returns:

- `params` - URL parameters
- `query` - Query string parameters
- `body` - Request body
- `req` - Express request object
- `res` - Express response object

### `useSetContext(key, value)`

Store data in the request context (available in middleware).

```tsx
const authMiddleware: MiddlewareFunction = (req, next) => {
  useSetContext("user", { id: 1, name: "John" });
  return next();
};
```

### `useContext(key)`

Retrieve data from the request context (available in route handlers and middleware).

```tsx
<Route path="/me" method="GET">
  {() => {
    const user = useContext("user");
    return <Response json={user} />;
  }}
</Route>
```

## Features

- 🔥 **Hot Reload** - Automatic server restart on file changes (development)
- 🎯 **Type Safe** - Full TypeScript support
- ⚡ **Fast** - Built on Express.js
- 🧩 **Composable** - Use React patterns for API logic
- �️ **Middleware Support** - Authentication, logging, and custom middleware
- 🗂️ **Route Grouping** - Organize routes with shared prefixes
- �📦 **Zero Config** - Works out of the box
