import Ember from 'ember';
import I18nInstanceInitializer from 'ember-flexberry/instance-initializers/i18n';
import { module, test } from 'qunit';
import startApp from '../../helpers/start-app';
import destroyApp from '../../helpers/destroy-app';

let application;
let appInstance;
let fakeLocale;

module('Unit | Instance Initializer | i18n', {
  beforeEach: function() {
    application = startApp();
    appInstance = application.buildInstance();

    // Set 'fake-locale' as default i18n-service locale.
    let i18n = appInstance.lookup('service:i18n');
    fakeLocale = 'fake-locale';
    i18n.set('locale', fakeLocale);
  },
  afterEach: function() {
    destroyApp(appInstance);
    destroyApp(application);
  }
});

test('Configures i18n service for locale', function(assert) {
  assert.expect(2);

  let i18n = appInstance.lookup('service:i18n');
  let ENV = appInstance._lookupFactory('config:environment');
  let defaultLocale = (ENV.i18n || {}).defaultLocale;

  assert.strictEqual(i18n.get('locale'), fakeLocale, 'Default i18n-service locale is \'' + fakeLocale + '\'');

  var currentLocale = defaultLocale ? defaultLocale :
    window.navigator.languages ? window.navigator.languages[0] : (window.navigator.language || window.navigator.userLanguage);

  var locales = appInstance.lookup('controller:application').get('locales');
  if (!locales || Ember.typeOf(locales) !== 'array' || locales.indexOf(currentLocale) === -1 || Ember.isBlank(currentLocale)) {
    currentLocale = 'en';
  }

  I18nInstanceInitializer.initialize(appInstance);

  assert.strictEqual(i18n.get('locale'), currentLocale, 'Current i18n-service locale is \'' + currentLocale + '\'');
});
