<template>
	<router-view></router-view>
</template>
<script>
	import SignStore from './sign/SignStore'

	export default {
		ready() {
			SignStore.currentUser().then(data => {}, err => {
				Router.go('/sign');
			});
		}
	}
</script>