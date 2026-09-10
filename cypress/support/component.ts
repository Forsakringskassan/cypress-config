import { configure, mount } from "@forsakringskassan/cypress-config/support";
import "./component.scss";

configure({
    resetEmulatedMedia: true,
    afterEach: {
        htmlvalidate: true,
    },
});

Cypress.Commands.add("mount", mount);
