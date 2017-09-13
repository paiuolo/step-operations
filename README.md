# \<step-operations\>

Polymer step operations webcomponents

[![Published on webcomponents.org](https://img.shields.io/badge/webcomponents.org-published-blue.svg)](https://www.webcomponents.org/element/owner/my-element)


## Install the Polymer-CLI

First, make sure you have the [Polymer CLI](https://www.npmjs.com/package/polymer-cli) installed. Then run `polymer serve` to serve your element locally.

## Viewing Your Element

```
$ polymer serve
```


## Usage

```html
<dom-bind>
    <template>
        <step-operation-container
            operation-as-string="{{ string_tool_step_operation }}" 
            operation="{% verbatim %}{{operation}}{% endverbatim %}">
            
            <operation-step
                operation="{% verbatim %}{{operation}}{% endverbatim %}"
                result="{% verbatim %}{{selected_name}}{% endverbatim %}">

                <div class="field">
                    <dropdown-selector
                        url="..." 
                        selected="{% verbatim %}{{selected_name}}{% endverbatim %}"
                        </dropdown-selector>
                </div>
            </operation-step>
            
            <operation-step
                operation="{% verbatim %}{{operation}}{% endverbatim %}"
                result="{% verbatim %}{{selected_surname}}{% endverbatim %}">

                <div class="field">
                    <dropdown-selector
                        url="..." 
                        selected="{% verbatim %}{{selected_surname}}{% endverbatim %}"
                        </dropdown-selector>
                </div>
            </operation-step>
            
            <operation-step
                operation="{% verbatim %}{{operation}}{% endverbatim %}"
                result="{% verbatim %}{{operation_result}}{% endverbatim %}">
                
                <django-csrf-token headers="{% verbatim %}{{tokenHeaders}}{% endverbatim %}"></django-csrf-token>
                
                <apply-operation-step
                    operation="{% verbatim %}{{operation}}{% endverbatim %}"
                    result="{% verbatim %}{{operation_result}}{% endverbatim %}"
                    url="..."
                    headers="[[tokenHeaders]]">
                    
                    <div class="review">
                        [[selected_name]] [[selected_surname]]
                    </div>
                </apply-operation-step>
            </operation-step>
            
            
            <operation-step
                operation="{% verbatim %}{{operation}}{% endverbatim %}">
                
                <div class="result">
                    <h2>[[operation_result.message]]</h2>
                </div>
                
            </operation-step>
        </step-operation-container>
    </template>
</dom-bind>
```

Operation JSON object example:

```html
{
    "key": "module.name",
    "name": "Operation name",
    "description": "...",
    "steps": [
        {
            "key": "select_name",
            "name": "Select name",
            "description": null,
            "enabled": true,
            "enables": ["select_surname"],
            "result": null
        },
         {
            "key": "select_surname",
            "name": "Select surname",
            "description": none,
            "enabled": false,
            "enables": ["review"],
            "result": null
        },
         {
            "key": "review",
            "name": "Review",
            "description": null,
            "enabled": false,
            "enables": ["results"],
            "result": null
        },
         {
            "key": "results",
            "name": "Results",
            "description": null,
            "enabled": false,
            "enables": [],
            "result": null
        }
    ]
}
```

#### Options:

...


## Running Tests

```
$ polymer test
```

Your application is already set up to be tested via [web-component-tester](https://github.com/Polymer/web-component-tester). Run `polymer test` to run your application's test suite locally.

## Contributing

1. Fork it!
2. Create your feature branch: `git checkout -b my-new-feature`
3. Commit your changes: `git commit -am 'Add some feature'`
4. Push to the branch: `git push origin my-new-feature`
5. Submit a pull request :D


## History

TODO: Write history


## Credits

TODO: Write credits


## License

Apache 2.0