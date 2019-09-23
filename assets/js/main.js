$(function() {
    var failResponse = "command not found: ";
    var matchResponse = "lol you think this actually works? sorry ;)";
    var easterEgg = "u hacked me bye :'(";
    
    var matchCommands = [
        "cal",
        "cat",
        "cd",
        "chmod",
        "cp",
        "date",
        "df",
        "du",
        "find",
        "jobs",
        "kill",
        "less",
        "more",
        "ls",
        "man",
        "mkdir",
        "mv",
        "ps",
        "pwd",
        "rm",
        "rmdir",
        "set",
        "vi",
    ];
    
    var data = [
        {
            "command": "whoami",
            "response": "Hi! I'm Joe, a recent Computer Science graduate from UCF and Software Engineer at L3 Harris Technologies.<br><br>" +
			"During my last year at UCF, my team won 1st in discipline (computer science) at Florida's State-Wide Student Engineering Design Showcase. See <a href='/press_0'>this</a> tweet and <a href='/press_1'>this</a> article.<br>"
        },
        {
            "command": "cd info",
        },
        {
            "command": "ls -1",
            "prompt": "~/info",
            "response": "<a href='mailto:joeleav1+site@gmail.com'>email</a><br>" + 
                        "<a href='/resume'>resume</a><br>" + 
                        "<a href='/github'>github</a><br>" + 
                        "<a href='/linkedin'>linkedin</a><br>" + 
                        "about_me.txt"
        },
        {
            "command": "cat about_me.txt",
            "prompt": "~/info",
            "response": "I enjoy drinking quality green tea and playing competitive video games (Dota, StarCraft, World of Warcraft). During my youth I was in the 99.99th percentile in all 3 of those video games."
        },
    ];
    
    function createLevel() {
        var level = $("<div class='level is-mobile'></div>");
        var levelLeft = $("<div class='level-left'></div>");
        level.append(levelLeft);
        $(".code").append(level);
        return levelLeft;
    }
    
    function createTyped(element, text, callback) {
        var typed = new Typed(element, {
            strings: [text],
            onComplete: callback, 
        });
    }
    
    function addPrompt(index) {
        var level = createLevel();
        var tagName = "command-" + index;
        var prompt = "~";
        if (data[index] && data[index].prompt) {
            prompt = data[index].prompt;
        } else if (index >= data.length) {
            prompt = data[data.length - 1].prompt;
        }
        level.append($("<span class='prompt'>" + prompt + "</span><span class='triangle'></span>"));
        level.append($("<span class='command' id='" + tagName + "'></span>"));
    }
    
    function showFinalPrompt() {
        var response = $("<div class='response'></div>");
        $(".code").append(response);
        var field = $("<input class='input' id='user-prompt'></input>");
        var submit = $("<input class='hidden' type='submit'></input>");
        var form = $("<form></form>");
        form.append(field);
        form.append(submit);
        form.submit(function(e) {
            e.preventDefault();
            var command = field.val().split(/(\s)/)[0];
            if (field.val() === "sudo rm -rf /") {
                response.html(easterEgg);
                field.prop("disabled", true);
            } else if (matchCommands.indexOf(command.toLowerCase()) > -1) {
                response.html(matchResponse);
                field.prop("disabled", true);
            } else if (field.val()) {
                response.html(failResponse + command);
                field.prop("disabled", true);
            }
        });
        $("#command-" + data.length).append(form);
        field.focus();
    }
    
    function typeCommand(index) {
        createTyped("#command-" + index, data[index].command, function() {
            $(".typed-cursor").hide();
            setTimeout(function() {
                showResponse(index);
                addPrompt(index + 1);
                if (index + 1 === data.length) {
                    showFinalPrompt();
                } else {
                    setTimeout(function() {
                        typeCommand(index + 1);
                    }, 250);
                }
            }, 250);
        });
    }
    
    function showResponse(index) {
        if (data[index].response) {
            var response = $("<div class='response'></div>");
            response.html("<p>" + data[index].response + "</p>");
            $(".code").append(response);
        }
    }
    
    $(document).ready(function() {
        var responded = false;
        addPrompt(0);
        typeCommand(0);
    });
});
