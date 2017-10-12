const tests = require.context("./src", true, /-test\.ts$/);
tests.keys().forEach(tests);

const components = require.context('./src', true, /^(?!.*(?:-test|index\.ts$)).*\.ts$/);
components.keys().forEach(components);