<template>
	<sunset-layout title="数据字典管理">
		<sunset-crud :options="options"></sunset-crud>
	</sunset-layout>
	<dictionary-enum></dictionary-enum>
</template>
<script>
	import DictionaryEnum from './DictionaryEnum';
	import DictionaryStore from './DictionaryStore';

	export default {
		components: {
			DictionaryEnum
		},
		data() {
			return {
				options: {
					title: '数据字典',
					store : DictionaryStore,
					tableOptions: {
						store: DictionaryStore,
						showIndex: true,
						columns: [{
							title: '字典名称',
							name: 'name'
						}, {
							title: '类型',
							name: 'type'
						}],
						pageSize: 10,
						localPage: false,
						lazy : true,
						format: {
							list: 'rows',
							count: 'count',
							pageSize: 'pageSize',
							currentPage: 'pageNumber'
						},
						filter: {
							align: 'right',
							fields: [{
								label: '搜索',
								name: 'keyword',
								widget: 'search',
								placeholder: '字典类型'
							}]
						},
						toolbar: [{
							label: '新增',
							icon: 'plus-round',
							color: 'success',
							signal: 'ADD',
							permission: 'Dictionary_ADD'
						}],
						recordTools: [{
							label: '枚举',
							icon: 'ios-pricetags',
							color: 'info',
							operate: (record) => {
								this.$broadcast('DICTIONARY_ENUM_SHOW', record);
							},
							permission: 'Dictionary_ENUM'
						}, {
							label: '修改',
							icon: 'edit',
							color: 'warning',
							signal: 'MODIFY',
							permission: 'Dictionary_MODIFY'
						}, {
							label: '删除',
							icon: 'trash-a',
							color: 'error',
							signal: 'DELETE',
							permission: 'Dictionary_DELETE'
						}]
					},
					formOptions: {
						fields: [{
							label: '字典名称',
							name: 'name',
							type: 'input',
							validate: {
								required: true,
								maxlength: 24
							}
						}, {
							label: '字典类型',
							name: 'type',
							type: 'input',
							validate: {
								required: true,
								maxlength: 24
							}
						}],
						format: (model) => {
							return model;
						},
						store: DictionaryStore
					}
				}
			}
		}
	};
</script>