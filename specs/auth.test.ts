import {Severity} from "jest-allure/dist/Reporter";

import DataHelper from "../helpers/dataHelper";
import AuthPage from "../pages/auth.page";
import MainPage from "../pages/main.page";

declare const reporter: any;

const userName = 'Tester'

describe(`Example test`, () => {
    beforeAll(async () => {
        await AuthPage.openAuthPageByUrl()
    })

    it('Should be able to register', async () => {
        reporter.description('Open search page test and assert search input')
        reporter.severity(Severity.Blocker)

        reporter.startStep('Open register page');
        await AuthPage.switchOnRegPage()
        reporter.endStep();

        reporter.startStep('Register user');
        await AuthPage.regUser(userName, DataHelper.randomValidEmail(), '123456')
        await AuthPage.clickOnSubmitBtn()
        reporter.endStep();

        reporter.startStep('Assert that user is logged in');
        await MainPage.assertThatUserIsLoggedIn()
        reporter.endStep();
    })

    it('Welcome text should contain user name', async () => {
        reporter.description('Assert that welcome text in header contain user name')
        reporter.severity(Severity.Minor)

        reporter.startStep('Assertion');
        await MainPage.assertThatHelloTextContainsUserName(userName)
        reporter.endStep();
    })
})
