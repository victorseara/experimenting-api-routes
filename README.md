# Development progress

- [x] Develop test strategy for Api Routes;
- [ ] Implements multipart form data in Abstract Route;
- [x] Test Core lib;
- [x] Create operation interface;
- [x] Create snippets:
  - [x] Injecting Core dependencies;
  - [x] Create route;
  - [x] Create client;
  - [x] Create config;
  - [ ] Create query;
  - [ ] Create prefetchQuery;
  - [ ] Create mutation;
  - [x] Create params schema + type;
  - [x] Create body schema + type;
  - [x] Create response type;
  - [ ] Create operation;
- [ ] Create generator:
  - feature generator
    - [feature-name] -> dir
      - src -> dir
        - server -> dir
          - get-[feature-name] -> dir
            - get-[feature-name].client
            - get-[feature-name].config
            - get-[feature-name].route
            - get-[feature-name].schema
            - get-[feature-name].test
        - ui -> dir
          - my-page.page
        - hooks -> dir
          - use-get-my-page
  - route generator
    - [method]-[name] -> dir
      - get-[feature-name].client
      - get-[feature-name].config
      - get-[feature-name].route
      - get-[feature-name].schema
      - get-[feature-name].test
- Route generator should add an entry to the server.ts and register the route in the api
- Feature generator should register the generated route in the api and the generated page in the selected app;

## Creating a page

1. Create a nextjs library
2. Delete lib folder
3. Create dirs ui, server, hooks
4. Create ui/libname.page.tsx
5. Export page from index.tsx
6.
