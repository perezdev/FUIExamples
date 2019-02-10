var acceptablePassword = false;

$(document).ready(function () {
    //Define settings for reset password popup
    $('#password').popup({
        on: 'focus',
        position: 'right center',
        setFluidWidth: true
    });

    //Initialize progress bar for password complexity
    $('#passwordComplexityProgress').progress({
        percent: 0,
        hoverable: false
    });

    $('#password').on('keyup', function (e) {
        ProcessPasswordComplexity();
    });
    $('#password').focus(function (e) {
        ClearErrors();
    });

    $('#resetPassword').on('click', function (e) {
        ClearErrors();

        var isValid = true;

        var password = $('#password').val();
        var repeatPassword = $('#repeatPassword').val();

        //If password don't match, we'll stop the button from submitting
        if (password !== repeatPassword) {
            SetError('Passwords do not match.');

            isValid = false;
            e.preventDefault();
        }
        //If the password does not meet the minimum requirements, we'll stop the button from submitting
        if (!acceptablePassword) {
            SetError('Your chosen password does not meet the minimum requirements.');

            isValid = false;
            e.preventDefault();
        }
        //I would hope that people wouldn't use our examples, but just in case
        if (IsPasswordOneOfTheExamples()) {
            SetError('Please choose a unique password that is not one of our examples.');

            isValid = false;
            e.preventDefault();
        }

        if (isValid) {
            alert('Congrats! All password requirements met.');
        }
    });
});

//https://uit.stanford.edu/service/accounts/passwords/quickguide
function ProcessPasswordComplexity() {
    var passwordValue = $('#password').val();

    if (passwordValue.length < 8) {
        ChangeProgressBarLevel(0);
    }

    //First level complexity. Between 8 and 11 characters. Contains mixed case letters, numbers, and symbols
    if (passwordValue.length > 7 && passwordValue.length < 12) {
        var levelOneContainsNumber = ContainsNumber(passwordValue);
        var levelOnecontainsCharacter = ContainsCharacter(passwordValue);
        var levelOnecontainsUppercaseLetter = ContainsUppercaseLetter(passwordValue);
        var levelOnecontainsLowercaseLetter = ContainsLowercaseLetter(passwordValue);

        if (levelOneContainsNumber && levelOnecontainsCharacter && levelOnecontainsUppercaseLetter && levelOnecontainsLowercaseLetter) {
            ChangeProgressBarLevel(1);
        }
    }

    //Second level of complexity. Between 12 and 15 characters. Contains mixed case letters and numbers
    if (passwordValue.length > 11 && passwordValue.length < 16) {
        var levelTwoContainsNumber = ContainsNumber(passwordValue);
        var levelTwoContainsUppercaseLetter = ContainsUppercaseLetter(passwordValue);
        var levelTwoContainsLowercaseLetter = ContainsLowercaseLetter(passwordValue);

        if (levelTwoContainsNumber && levelTwoContainsUppercaseLetter && levelTwoContainsLowercaseLetter) {
            ChangeProgressBarLevel(2);
        }
    }

    //Third level of complexity. Between 16 and 19 characters. Contains mixed case letters
    if (passwordValue.length > 15 && passwordValue.length < 20) {
        var levelThreeContainsUppercaseLetter = ContainsUppercaseLetter(passwordValue);
        var levelThreeContainsLowercaseLetter = ContainsLowercaseLetter(passwordValue);

        if (levelThreeContainsUppercaseLetter && levelThreeContainsLowercaseLetter) {
            ChangeProgressBarLevel(3);
        }
    }
    //Fourth level of complexity. 21 characters or more. Doesn't matter what those characters are.
    if (passwordValue.length > 20) {
        ChangeProgressBarLevel(4);
    }
}
function ChangeProgressBarLevel(level) {
    var $progress = $('#passwordComplexityProgress');
    $('#passwordComplexityProgress').removeClass(); //Remove all CSS classes, so we can update it with the appriate ones

    if (level === 0) { //Unacceptable password
        acceptablePassword = false;
        $progress.addClass('ui small red progress');
        SetProgressPercentageValue(0);

        $('#passwordComplexityProgress').progress('set label', 'Not complex enough');
    }
    else if (level === 1) { //Weak password
        acceptablePassword = true;
        $progress.addClass('ui small yellow progress');
        SetProgressPercentageValue(25);

        $('#passwordComplexityProgress').progress('set label', 'Weak, but sufficient.');
    }
    else if (level === 2) { //Decent, but not ideal
        acceptablePassword = true;
        $progress.addClass('ui small progress');
        //Set the color of the bar directly, as the different shades of green don't exist and you can't set a color via their API
        $progress.children('.bar').css('background-color', '#B9D986');
        SetProgressPercentageValue(50);

        $('#passwordComplexityProgress').progress('set label', 'Good!');
    }
    else if (level === 3) { //Ideal password for most normal users
        acceptablePassword = true;
        $progress.addClass('ui small progress');
        //Set the color of the bar directly, as the different shades of green don't exist and you can't set a color via their API
        $progress.children('.bar').css('background-color', '#97CC88');
        SetProgressPercentageValue(75);

        $('#passwordComplexityProgress').progress('set label', 'Great password!');
    }
    else if (level === 4) { //As complex as need before diminishing returns
        acceptablePassword = true;
        //100% has it's own special color, so we'll just let it use its own
        $progress.addClass('ui small progress');
        SetProgressPercentageValue(100);

        //\x27 is the escape character for a single quote.
        $('#passwordComplexityProgress').progress('set label', 'Couldn\x27t get any better!');
    }
}
function SetProgressPercentageValue(value) {
    $('#passwordComplexityProgress').progress({
        percent: value
    });
}
function ContainsLetter(value) {
    if (value.search(/[a-zA-Z]/) == -1) {
        return false;
    }
    else {
        return true;
    }
}
function ContainsNumber(value) {
    if (value.search(/\d/) == -1) {
        return false;
    }
    else {
        return true;
    }
}
function ContainsCharacter(value) {
    var chars = /[ !@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/;
    if (chars.test(value)) {
        return true;
    }
    else {
        return false;
    }
}
function ContainsUppercaseLetter(value) {
    if (value.search(/[A-Z]/) == -1) {
        return false;
    }
    else {
        return true;
    }
}
function ContainsLowercaseLetter(value) {
    if (value.search(/[a-z]/) == -1) {
        return false;
    }
    else {
        return true;
    }
}

function SetError(message) {
    $('#errorMessage').css('display', 'block');
    $('#errorMessage').html(message);
}
function ClearErrors() {
    $('#errorMessage').css('display', 'none');
    $('#errorMessage').html('');
}
function IsPasswordOneOfTheExamples() {
    var passwordValue = $('#password').val().toLocaleLowerCase();

    return (passwordValue === 'eight+forty=48' || passwordValue === 'i love walking my dog!' ||
        passwordValue === 'soccer book dog whale' || passwordValue === 'soccerbookdogwhale');
}