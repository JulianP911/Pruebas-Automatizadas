Feature: Crear post en el sitio web del usuario administrador

@user1 @web
Scenario: Como usuario administrador creo un nuevo post para publicarlo en el sitio web
  Given I navigate to page "<URL>"
  And I wait for 5 seconds
  And I login email "<USERNAME>" and password "<PASSWORD>"
  And I wait for 7 seconds
  When I click posts
  And I wait for 2 seconds
  And I click new post
  And I wait for 2 seconds
  And I enter post title "Mi primer blog de pruebas automatizadas programado"
  And I wait for 2 seconds
  And I enter post description "Bienvenidos a un mundo nuevo donde aprenderás sobre pruebas"
  And I wait for 2 seconds
  And I click publish
  And I wait for 2 seconds
  And I click schedule for later
  And I wait for 2 seconds
  And I enter utc hour "17:00"
  And I wait for 2 seconds
  And I click schedule
  And I wait for 2 seconds
  And I click confirm modal schedule
  And I wait for 2 seconds
  And I click back posts
  And I wait for 2 seconds
  Then I see post scheduled