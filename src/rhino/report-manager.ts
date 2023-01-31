import { Utilities } from "../extensions/utilities";
import { RhinoClient } from "../framework/rhino-client";
import { Operator } from "../logging/log-models";

export class ReportManager {
    // members: state
    private testRun: any;

    /**
     * Summary. Creates a new ReportManager instance.
     * 
     * @param testRun The RhinoTestRun by which to create the report.
     */
    constructor(testRun: any) {
        this.testRun = testRun;
    }

    /**
     * Summary. Get a simple and basic HTML report with CSS
     * 
     * @returns HTML string with the report data. 
     */
    public getHtmlReport(): string {
        // [v] TODO: get summary
        // [v] TODO: get test case
        // [v] TODO: get test steps
        // [v] TODO: get HTML layout
        // [ ] TODO: get passed test cases - by quality (lower to higher)
        // [ ] TODO: get failed test cases - by quality (lower to higher)

        // build
        let testCases: string[] = [];
        for (const testCase of this.testRun.testCases) {
            testCases.push(this.getSummaryTestCase(testCase));
        }

        return this.getHtml()
            .replace('$(title)', this.testRun.title)
            .replace('$(summaryOutcome)', this.getSummaryOutcome())
            .replace('$(summaryTestCase)', testCases.join(''));
    }

    // get the HTML report layout
    private getHtml(): string {
        // build
        let metaData =
            '<div style="margin: 0.25rem;">' +
            '   <pre>Start   : ' + this.testRun.start +
            '   <br/>End     : ' + this.testRun.end +
            '   <br/>Run Time: ' + this.testRun.runTime.substr(0, 11) + '</pre>' +
            '</div>';

        // get
        return `<html>
        <head>
            <style>
                pre {
                    overflow-x: auto;
                    white-space: pre-wrap;
                    white-space: -moz-pre-wrap;
                    white-space: -pre-wrap;
                    white-space: -o-pre-wrap;
                    word-wrap: break-word;
                }
                .steps-table {
                    padding: 0;
                    border: 0;
                    line-height: normal
                }
                .label {
                    box-sizing: border-box;
                    display: inline;
                    padding: .2em .6em .3em;
                    font-size: 75%;
                    font-weight: 700;
                    line-height: 1;
                    color: #fff;
                    text-align: center;
                    white-space: nowrap;
                    vertical-align: baseline;
                    background-color: #1ABB9C;
                }
                .panel {
                    font-size: 0.75rem;
                    font-weight: 400;
                    line-height: 1.125;
                    box-sizing: border-box;
                    color: #111;
                    background-color: #f6f7f8;
                    box-shadow: 0 1px 1px rgba(0,0,0,.05);
                    margin: 0.25rem;
                }
                .card {
                    background-clip: border-box;
                    box-sizing: border-box;
                    display: flex;
                    flex-direction: column;
                    min-width: 0;
                    margin-bottom: 1rem !important;
                    max-width: 20rem;
                    border: solid 1px #2a2a2a
                }
                .card-header {
                    font-size: 1rem;
                    font-weight: 400;
                    line-height: 1.5;
                    color: #fff;
                    word-wrap: break-word;
                    box-sizing: border-box;
                    padding: 0.5rem 1rem;
                    margin-bottom: 0;
                    background-color: #2a2a2a;
                    text-align: center;
                }
                .card-body {
                    font-size: 3rem;
                    font-weight: 600;
                    text-align: center;
                    line-height: 1.5;
                    color: #111;
                    word-wrap: break-word;
                    box-sizing: border-box;
                    flex: 1 1 auto;
                    padding: 1rem 1rem;
                    background-color: #fff;
                }
                table {
                    table-layout: fixed ;
                    width: 100% ;
                  }
                  tr:nth-child(even) {
                    background-color: #e7e9eB;
                  }
                  td {
                    width: 25% ;
                  }

                input[type="checkbox"] {
                    display: none;
                }
                .wrap-collabsible {
                    margin: 1.2rem 0;
                }
                .lbl-toggle {
                    display: block;
                    font-weight: bold;
                    font-family: monospace;
                    font-size: 1.2rem;
                    text-transform: uppercase;
                    text-align: center;
                    padding: 1rem;
                    color: #ddd;
                    background: #0069ff;
                    cursor: pointer;
                    transition: all 0.25s ease-out;
                }
                .lbl-toggle:hover {
                    color: #fff;
                }
                .lbl-toggle::before {
                    content: " ";
                    display: inline-block;
                    border-top: 5px solid transparent;
                    border-bottom: 5px solid transparent;
                    border-left: 5px solid currentColor;
                    vertical-align: middle;
                    margin-right: 0.7rem;
                    transform: translateY(-2px);
                    transition: transform 0.2s ease-out;
                }
                .toggle:checked + .lbl-toggle::before {
                    transform: rotate(90deg) translateX(-3px);
                }
                .collapsible-content {
                    max-height: 0px;
                    overflow: hidden;
                    transition: max-height 0.25s ease-in-out;
                }
                .toggle:checked + .lbl-toggle + .collapsible-content {
                    max-height: 100%;
                }
                .toggle:checked + .lbl-toggle {
                }
                .collapsible-content .content-inner {
                    background: rgba(0, 105, 255, 0.2);
                    border-bottom: 1px solid rgba(0, 105, 255, 0.45);
                    padding: 0.5rem 1rem;
                }
                .collapsible-content p {
                    margin-bottom: 0;
                }
            </style>
        </head>
        <body>
            <h2>$(title)</h2>
            ${metaData}
            $(summaryOutcome)
            $(summaryTestCase)
        </body>
        </html>`;
    }

    // get tests summary HTML
    private getSummaryOutcome(): string {
        // build components
        let qualityColor = this.testRun.qualityRank < 80 ? '#e74c3c' : '#1abb9c';
        let totalPass = `
        <td>
        <div class="card">
            <div class="card-header" title="The amount of successful tests.">Total Pass</div>
            <div class="card-body" style="color: #1abb9c;">${this.testRun.totalPass}</div>
        </div>
        </td>`;

        let totalFail = `
        <td>
        <div class="card">
            <div class="card-header" title="The amount of failed tests.">Total Fail</div>
            <div class="card-body" style="color: #e74c3c;">${this.testRun.totalFail}</div>
        </div>
        </td>`;

        let totalInconclusive = `
        <td>
        <div class="card">
            <div class="card-header" title="The amount of tests which Rhino did not verify or skipped due to, lack of assertions or tolerance configuration.">Total Inconclusive</div>
            <div class="card-body" style="color: #f0ad4e;">${this.testRun.totalInconclusive}</div>
        </div>
        </td>`;

        let qualityRank = `
        <td>
        <div class="card">
            <div class="card-header" title="The overall quality (the expected application behavior) of the test run.">Quality Rank</div>
            <div class="card-body" style="color: ${qualityColor}">${Math.round(this.testRun.qualityRank)}%</div>
        </div>
        </td>`;

        // get
        return `
        <table>
        <tr>
            ${totalPass}
            ${totalFail}
            ${totalInconclusive}
            ${qualityRank}
        </tr>
        </table>`;
    }

    private buildCollapsibleElement(name: string, htmlContent: string): string {
        let html =
            '<pre>' +
            '<details>' +
            `<summary>${name}</summary>` +
            `${htmlContent}` +
            '</details>' +
            '</pre>';
        return html;
    }

    buildEnvironmentElement(name: string, content: string): string {
        let htmlContentTag = this.getHtmlTag(content.toString());

        let collpasibleHtmlContent =
            `${htmlContentTag}` +
            `${content}` +
            `${htmlContentTag.replace('<', '</')}`;

        return content.length < 30
            ? `${htmlContentTag}` + `${name}: ${content}` + `${htmlContentTag.replace('<', '</')}`
            : this.buildCollapsibleElement(name, collpasibleHtmlContent);
    }

    private getHtmlTag(content: string) {
        return content.includes('xmlns') ? '<xmp>' : '<pre>';
    }

    private formatEnvironment(jsonObject: any): string {
        let result = '';
        for (let prop in jsonObject) {
            if (typeof (jsonObject[prop]) === 'object') {
                result += this.formatEnvironment(jsonObject[prop]);
            }
            else {
                result += this.buildEnvironmentElement(prop, jsonObject[prop]);
            }
        }
        return result;
    }
    // get a single test case HTML
    private getSummaryTestCase(testCase: any): string {
        // setup
        let qualityColor = this.testRun.qualityRank < 80 ? '#e74c3c' : '#1abb9c';
        let metaData =
            '<pre>Start       : ' + testCase.start +
            '<br/>End         : ' + testCase.end +
            '<br/>Quality Rank: <span style="color: ' + qualityColor + '">' + testCase.qualityRank + '</span>' +
            '<br/>Run Time    : <span style="color: #3498db">' + testCase.runTime.substr(0, 11) + '</span>' +
            '<br/>On Attempt  : ' + testCase.passedOnAttempt + '</pre>';

        let environment = '';
        try {
            environment =
                '<h4>Environment</h4>' + this.formatEnvironment(testCase.environment) +
                '</div>';
        } catch (error) {
            console.warn(error);
        }

        // build
        let steps: string[] = [];
        for (let i = 0; i < testCase.steps.length; i++) {
            steps.push(this.getTestStepsHtml(testCase.steps[i], (i + 1).toString()));
        }

        // TODO: implement collapsable div for each test
        // // get
        // return `
        //     <div class="wrap-collabsible">
        //     <input id="${testCase.key}-${testCase.iteration}" class="toggle" type="checkbox" />
        //     <label for="${testCase.key}-${testCase.iteration}" class="lbl-toggle">${testCase.key}-${testCase.iteration}</label>
        //     <div class="collapsible-content">
        //         <div class="content-inner">
        //             <div class="panel">
        //             <div style="padding: 0.25rem;">
        //                 <span class="label">${testCase.key}-${testCase.iteration}</span>
        //                 ${metaData}<br/>
        //                 <div style="padding: 0.25rem;">
        //                     <table cellpadding="1" cellspacing="0" class="steps-table">${steps.join('')}</table>
        //                 </div>
        //             </div>
        //         </div>
        //     </div>
        //     </div>`

        // get
        return `
        <div class="panel">
        <div style="padding: 0.25rem;">
            <span class="label">${testCase.key}-${testCase.iteration}</span>
            ${metaData}${environment}<br/>
            <div style="padding: 0.25rem;">
                <table cellpadding="1" cellspacing="0" class="steps-table">${steps.join('')}</table>
            </div>
        </div>`;
    }

    private getTestStepsHtml(testStep: any, index: string): string {
        let isNull = testStep.steps === null || testStep.steps === undefined;
        let isRoot = isNull || testStep.steps.length === 0;

        if (isRoot) {
            return this.getTestStepHtml(testStep, index);
        }

        let stepsHtml: string[] = [];
        stepsHtml.push(this.getMetaStepHtml(testStep, index));
        for (let i = 0; i < testStep.steps.length; i++) {
            let html = this.getTestStepsHtml(testStep.steps[i], index + "." + (i + 1).toString());
            stepsHtml.push(html);
        }
        return stepsHtml.join('');
    }

    private getMetaStepHtml(testStep: any, index: string): string {
        // build
        const pattern = '(?<=\\{).*(?=\\})';
        const match = testStep.action.match(pattern);
        let action = match === null || match === undefined ? testStep.action : match[0];

        // get
        return `
        <tr>
            <td style="width: 5%; vertical-align: top;"><pre>${index}</pre></td>
            <td style="width: 3%; vertical-align: top;"><pre style="font-weight: 900; color: #3498db">M</pre></td>
            <td colspan="2" style="font-weight: 900; width: 41%; vertical-align: top;"><pre>${action}</pre></td>
            <td style="width: 10%; vertical-align: top;"><pre style="color: #3498db">${testStep.runTime.substr(0, 11)}</pre></td>
        </tr>`;
    }

    private getTestStepHtml(testStep: any, index: string): string {
        // setup
        let actionColor = testStep.actual === true ? '#1abb9c' : '#e74c3c';
        let actionSign = testStep.actual === true ? 'P' : 'F';

        // get expected results
        let assertions: string[] = [];
        for (const result of testStep.expectedResults) {
            let assertion = result;
            // let assertionColor = assertion.actual === true ? '#000000' : '#e74c3c';
            let assertionHtml: string = this.buildAssertionsHtml(assertion);
            assertions.push(assertionHtml);
        }
        let assertionsHtml = assertions.join('<br />');

        return `
        <tr>
            <td style="width: 5%; vertical-align: top;"><pre>${index}</pre></td>
            <td style="width: 3%; vertical-align: top;"><pre style="font-weight: 900; color: ${actionColor}">${actionSign}</pre></td>
            <td style="width: 41%; vertical-align: top;"><pre>${testStep.action}</pre></td>
            <td style="width: 41%; vertical-align: top;">${assertionsHtml}</td>
            <td style="width: 10%; vertical-align: top;"><pre style="color: #3498db">${testStep.runTime.substr(0, 11)}</pre></td>
        </tr>`;
    }

    private getAssertionValues(expectedResult: unknown, reasonPhrase: unknown, assert:string) {
        let expected: string = "not found";
        let actual: string = "not found";
        var ddd:string[] = [];
        if (ddd){
            console.log("jjj");
        }            
        if (typeof expectedResult === 'string') {
            let findExpected = expectedResult.match(new RegExp(`(?<=${assert}.*{).*(?=\})`));
            if (findExpected) {
                expected = assert + ':' + findExpected[0];
            }
        }
        if (typeof reasonPhrase === 'string') {
            let findActual = reasonPhrase.match(new RegExp("(?<=Actual: ).*(?=)"));
            if (findActual) {
                actual = findActual[0];
            }
        }
        return [expected, actual];
    }

    private buildAssertionsHtml(assertion: any): string {
        let assertionHtml: string;
        let [expected, actual]:[string,string]=['',''];
        let assertionColor = '#000000';
        if (assertion.actual === false) {
            assertionColor = '#e74c3c';
            let assertTypeLiteral=this.findAssertType(assertion.expectedResult);
            if (assertTypeLiteral === 'string'){
                [expected, actual] = this.getAssertionValues(assertion.expectedResult, assertion.reasonPhrase, assertTypeLiteral);
            }
            else{
                console.log("fff"); 
            }
                           
            assertionHtml = `<pre style="color: ${assertionColor}">${assertion.expectedResult}
                                <br />expected:"${expected}"
                                <br />actual:"${actual}"                                
                                </pre>`;
        }
        else {
            assertionHtml = `<pre style="color: ${assertionColor}">${assertion.expectedResult}</pre>`;
        }
        return assertionHtml;
    }

    private findAssertType(expectedResult: unknown): string | undefined {
        // let assertionTypes = ["match", "equal"];
        let assertionTypes: Operator[]=[];
        // let client: RhinoClient = new RhinoClient("http://localhost:9900/");
        let client = new RhinoClient(Utilities.getRhinoEndpoint());
        let assertionTypesPromise = client.getOperatorsAsync();
        Promise.all([assertionTypesPromise]).then((result)=>{
            if(typeof result==='string'){
                assertionTypes=JSON.parse(result);
            }
        });
        if (typeof expectedResult === 'string') {
            for (let assert of assertionTypes) {
                if (expectedResult.indexOf(assert.literal) !== -1) {
                    return assert.literal;
                }
            }
        }
    }

    // private async findAssertType(expectedResult: string): Promise<string | undefined> {
    //     // let assertionTypes = ["match", "equal"];
    //     let client: RhinoClient = new RhinoClient("http://localhost:9900/");
    //     let assertionTypes: Operator[];
    //     let assertType = "any";
    //     return await client.getOperatorsAsync().then((result) => {
    //         if (typeof result === 'string') {
    //             assertionTypes = JSON.parse(result);
    //             for (let assert of assertionTypes) {
    //                 if (expectedResult.indexOf(assert.literal) !== -1) {
    //                     assertType = assert.literal;
    //                 }
    //             }
    //             return assertType;
    //         }
    //     });
    // }
}
