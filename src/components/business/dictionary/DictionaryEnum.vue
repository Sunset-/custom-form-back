<style lang="sass">
	.dictionary-enum-model {
		.ivu-modal-footer {
			display: none;
		}
	}
</style>
<template>
	<Modal class="dictionary-enum-model" :visible.sync="show" title="字典枚举" :width="800">
		<sunset-table v-ref:table :options="tableOptions"></sunset-table>
		<h5 style="margin-top:10px;">添加枚举</h5>
		<sunset-form v-ref:form :options="formOptions" @signal="operateSignal"></sunset-form>
		<div slot="footer">
		</div>
	</Modal>
</template>
<script>
	import DictionaryStore from './DictionaryStore';

	export default {
		data() {
			return {
				enums: null,
				tableOptions: {
					columns: [{
						title: '枚举名称',
						name: 'name'
					}, {
						title: '枚举标识',
						name: 'aliasName'
					}, {
						title: '枚举值',
						name: 'value'
					}],
					showIndex: true,
					pageSize: 10,
					localPage: true,
					multiCheck: false,
					sortable: true,
					format: {
						list: '',
						count: 'length',
						pageSize: 'pageSize',
						currentPage: 'pageNumber'
					},
					//表格工具栏
					toolbar: [],
					//表格搜索
					filter: false,
					deleteMethod: 'removeEnum',
					//数据条目操作
					recordTools: [{
						label: '修改',
						icon: 'edit',
						color: 'warning',
						permission: 'Dictionary_ENUM_UPDATE',
						operate: (record) => {
							this.edit(record);
						}
					}, {
						label: '删除',
						icon: 'trash-a',
						color: 'error',
						confirm: '确定删除此项',
						permission: 'Dictionary_ENUM_DELETE',
						operate: (record) => {
							DictionaryStore.removeEnum(record.id).then(res => {
								this.$refs.table.refresh(void 0, true);
							});
						}
					}, {
						label: '上移',
						icon: 'arrow-up-c',
						color: 'info',
						permission: 'Dictionary_ENUM_ORDER',
						operate: (record) => {
							var enums = this.enums;
							if (record != enums[0]) {
								var ordered = [];
								enums.forEach(item => {
									if (item == record) {
										var last = ordered.pop();
										ordered.push(item);
										ordered.push(last);
									} else {
										ordered.push(item);
									}
								});
								DictionaryStore.order(ordered.map((item, index) => `${item.id}:${index}`).join(',')).then(res => {
									this.$refs.table.refresh(void 0, true);
								});
							}
						}
					}, {
						label: '下移',
						icon: 'arrow-down-c',
						color: 'info',
						permission: 'Dictionary_ENUM_ORDER',
						operate: (record) => {
							var enums = this.enums;
							if (record != enums[enums.length - 1]) {
								var ordered = [];
								var waitItem = null;
								enums.forEach(item => {
									if (item == record) {
										waitItem = item;
									} else {
										ordered.push(item);
										if (waitItem) {
											ordered.push(waitItem);
											waitItem = null;
										}
									}
								});
								DictionaryStore.order(ordered.map((item, index) => `${item.id}:${index}`).join(',')).then(res => {
									this.$refs.table.refresh(void 0, true);
								});
							}
						}
					}],
					datasource: () => {
						return this.record ? DictionaryStore.loadEnums(this.record.typeStr).then(data => {
							return this.enums = (data || []);
						}) : [];
					},
					store: DictionaryStore
				},
				formOptions: {
					cols: 2,
					fields: [{
						label: '枚举名称',
						name: 'name',
						type: 'input',
						validate: {
							required: true,
							maxlength: 24
						}
					}, {
						label: '枚举标识',
						name: 'aliasName',
						type: 'input',
						validate: {
							required: true,
							maxlength: 24
						}
					}, {
						label: '枚举值',
						name: 'value',
						type: 'input',
						validate: {
							required: true,
							maxlength: 24
						}
					}],
					format: (model) => {
						model.dictionaryType = this.record.typeStr;
						model.orderField = model.orderField || this.enums.length;
						return model;
					},
					hideBtns: true,
					store: DictionaryStore,
					method: 'saveEnum'
				},
				show: false,
				record: null
			};
		},
		methods: {
			loadEnums(page) {
				this.$refs.table.refresh(page, true);
			},
			edit(item) {
				this.$refs.form.reset(Object.assign({}, item));
			},
			operateSignal(signal) {
				if (signal == 'SAVED') {
					this.$refs.form.reset();
					this.loadEnums(void 0);
				} else if (signal == 'CANCEL') {
					this.show = false;
				}
			}
		},
		events: {
			DICTIONARY_ENUM_SHOW(record) {
				this.record = record;
				this.loadEnums(1);
				this.show = true;
			}
		}
	}
</script>