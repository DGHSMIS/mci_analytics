# The Library folder has its own package.json file and node_modules folder

## Get started:

# Navigate to the project's <components> folder.

1. Clone: git clone git@gitlab.com:arits/products/component-library.git
2. Cut everything inside the cloned <component-library> folder and paste into the <components> folder.
3. Add this line in <tsconfig.json> in the "paths" object: "@library/_": ["app/components/Library/_"],
4. Run: yarn
