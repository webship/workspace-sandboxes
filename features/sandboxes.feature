Feature: The Sandboxes workspace plugin
  Once the plugin is activated and installed, the sandboxes workspace is on the dashboard, and the
  Plugins page lists the plugin with its four steps.

  Scenario: The workspace page is there
    Given I am on "/sandboxes"
     Then I should see "Sandboxes"

  Scenario: The plugin is listed on the Plugins page
    Given I am on "/settings/plugins"
     Then I should see "Sandboxes"
      And I should see "@webship/workspace-sandboxes"
