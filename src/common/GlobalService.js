(function (window) {

    //全局服务
    var GlobalService = window.GlobalService = window.GlobalService || {};

    //获取自定义表单
    GlobalService.getCustomForm = (function () {
        const FormFunctionAttributes = [
            'cast',
            'rebuild',
            'format',
            'submit',
            'validate'
        ];
        const FieldFunctionAttributes = [
            'other',
            'validate'
        ];
        const cache = {}

        var pkg = {
            getFormConfig(no) {
                return Promise.resolve().then(() => {
                    if (cache[no]) {
                        return Sunset.clone(cache[no]);
                    } else {
                        return $http({
                            url: '/manage-service/designed_form',
                            data: {
                                formNos: no
                            }
                        }).then(res => {
                            if (res && res.length) {
                                var config = this._cast(res[0]);
                                cache[no] = config;
                                return Sunset.clone(config);
                            } else {
                                throw new Error(`未找到表单配置:${no}`);
                            }
                        });
                    }
                });
            },
            _cast(form) {
                var config = null;
                try {
                    config = JSON.parse(form.formContent);
                } catch (e) {
                    throw new Error(`表单配置格式错误:${e}`);
                }
                FormFunctionAttributes.forEach(key => {
                    if (config[key]) {
                        config[key] = this._castStringToObject(config[key]);
                    }
                });
                var fields = config.fields;
                config.fields = fields.map(field => {
                    var other = field.other && this._castStringToObject(field.other) || {},
                        validate = field.validate && this._castStringToObject(field.validate);
                    delete field.other;
                    delete field.validate;
                    var field = Object.assign(other, field);
                    if (validate) {
                        field.validate = validate;
                    }
                    return field;
                });
                return config;
            },
            _castStringToObject(str) {
                if (Sunset.isString(str)) {
                    return eval('(' + str + ')')
                } else {
                    return str;
                }
            }
        }
        return function (no) {
            return pkg.getFormConfig(no);
        }
    })();

})(window);