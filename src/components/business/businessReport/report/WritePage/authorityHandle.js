import authority from './authority';
/**
 * [AuthorityHandle description]
 * @param {[type]} options [description]
 * {
 *      is_double_sign:bool,
 *      is_not_team:bool,
 *      own_privilege:number,
 *      report_status:number,
 *      task_status:number,
 *      is_abandon:bool
 * }
 * @param {[type]} type    [description]
 * {
     CONSULTATION_REPORT,CONSULTATION,REJECT,REVIEW,FORWARD,SUBMIT,REPLY_REVIEW:
 * }
 */
export default function AuthorityHandle(options, type) {
    let _dictionary = {
        Is_Double_Sign: 'is_double_sign',
        Is_Not_Team: 'is_not_team',
        Own_Privilege: 'own_privilege',
        Report_Status: 'report_status',
        Is_Not_Owner: 'is_not_owner',
        // Task_Status:'task_status',
        Is_Abandon: 'is_abandon',
        // Is_Not_Consultation: 'is_not_consultation',
        // Is_Consultation: 'is_consultation',
        // Is_ConSultation_Writer: 'is_consultation_writer',
        // Is_ConSultation_Submiter: 'is_consultation_submiter',
        // Is_ConSultation_Reviewer: 'is_consultation_reviewer'
    };
    let list = [];

    for (let key in _dictionary) {

        let value = _dictionary[key];
        // if(key == 'Is_ConSultation_Writer'){
        //     debugger;
        // }

        if (!options[value] && options[value] !== 0) {
            continue;
        }
        let Button_Authority = {};
        if (typeof options[value] == 'boolean') {
            if (options[value]) {
                Button_Authority = authority[key];
            }
        } else {
            let m = authority[key];

            Button_Authority = m[options[value]];
        }
        if (!Button_Authority || !Button_Authority[type]) {}
        list.push(Button_Authority[type]);
    }

    let canUse = list[0] || false;
    for (var i = 1; i < list.length; i++) {
        canUse = canUse && list[i];
    }
    return canUse;
}