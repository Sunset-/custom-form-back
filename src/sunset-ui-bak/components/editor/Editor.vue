<style lang="sass">
	.sunset-editor-container {
		width: 100%;
		.edui-editor {
			z-index: 800 !important;
		}
		.edui-editor-bottomContainer {
			display: none;
		}
		&.sunset-editor-readonly {
			.edui-editor-toolbarbox {
				display: none;
			}
		}
	}
</style>
<template>
	<div :class="['sunset-editor-container',readOnly?'sunset-editor-readonly':'']">
		<script :id="id" type="text/plain">
			我是编辑器
		</script>
	</div>
</template>
<script>
	var uid = 0;

	export default {
		props: {
			toolbar: {

			},
			value: {

			},
			readonly: {

			}
		},
		data() {
			return {
				id: '',
				waitValue: null,
				ready: false,
				pending: false
			};
		},
		computed: {
			readOnly() {
				return this.readonly === true || this.readonly === "";
			}
		},
		methods: {
			init() {
				if (!UE) {
					throw new Error('请装载UEditor组件');
				}
				this.ready = false;
				this.id = `sunset-editor-${++uid}`;
				this.$nextTick(() => {
					//挂载插件
					var opts = {
						initialContent: '',
						saveInterval: 9999999999
					};
					if (this.toolbar) {
						opts.toolbars = [this.toolbar.split(',').map((item) => item.trim())];
					}
					var editor = this.editor = UE.getEditor(this.id, opts);
					//初始化值
					editor.ready(() => {
						editor.setContent(this.waitValue || '');
						this.ready = true;
						//监听
						editor.addListener('contentChange', () => {
							this.pending || this.setValueSilent(editor.getContent());
						});
						//只读
						if (this.readOnly) {
							editor.setDisabled();
						} else {
							editor.setEnabled();
						}
						// editor.addListener('focus', () => {
						// 	this.pending || this.setValueSilent(editor.getContent());
						// });
					});
				});
			},
			setValueSilent(value) {
				this.pending = true;
				this.value = value;
				this.$nextTick(() => {
					this.pending = false;
				})
			},
			setWidth(w) {
				$(`#${this.id} .edui-editor`).css('width', w);
			}
		},
		ready() {
			this.init();
		},
		watch: {
			value(v) {
				if (!this.pending) {
					if (this.ready) {
						this.editor.setContent(v || '');
						this.editor.focus(true);
					} else {
						this.waitValue = v;
					}
				}
			},
			readonly(v) {
				try {
					//只读
					console.log('EDITOR-READONLY:' + v);
					if (!!v) {
						this.editor.setDisabled();
					} else {
						this.editor.setEnabled();
					}
				} catch (e) {
					console.warn(e);
				}
			}
		}
	};
</script>