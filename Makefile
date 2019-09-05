# generate js code for grpc proto file
gen-js:
	./node_modules/.bin/grpc_tools_node_protoc \
		--js_out=import_style=commonjs,binary:./src/codegen/api/ \
		--grpc_out=./src/codegen/api/ \
		--plugin=protoc-gen-grpc=./node_modules/.bin/grpc_tools_node_protoc_plugin \
		--proto_path=./src/api/ \
		api.proto

# generate ts code for grpc messages and service
gen-ts:
	# ./node_modules/.bin/pbjs -t static-module -w commonjs
	# 	-o ./src/codegen/api/api.pb.js
	# 	./src/api/api.proto
	# ./node_modules/.bin/pbts -o ./src/codegen/api/api.d.ts
	# 	./src/codegen/api/api.pb.js
	protoc \
		--plugin=protoc-gen-ts=./node_modules/.bin/protoc-gen-ts \
		--ts_out=./src/codegen/api \
		--proto_path=./src/api/ \
		api.proto