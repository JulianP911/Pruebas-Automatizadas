Feature: Crear post en el sitio web del usuario administrador

@user1 @web
Scenario: Como usuario administrador creo un nuevo post para publicarlo en el sitio web
  Given I navigate to page "http://localhost:2368/ghost/#/signin"
  And I login email "<USERNAME>" and password "<PASSWORD>"
  And I wait for 3 seconds
  When I click posts
  And I wait for 2 seconds
  And I click new post
  And I wait for 2 seconds
  And I enter post title "Mi primer blog de pruebas automatizadas"
  And I wait for 2 seconds
  And I enter post description "Bienvenidos a un mundo nuevo donde aprenderás sobre pruebas"
  And I wait for 2 seconds
  And I click publish
  And I wait for 2 seconds
  And I click continue, final review
  And I wait for 2 seconds
  And I click publish post, right now
  And I wait for 2 seconds
  And I click editor
  And I wait for 2 seconds
  And I click back posts
  And I wait for 2 seconds
  And I click published
  And I wait for 2 seconds
  Then I see post published