repo_root=$PWD

cleanup() {
    cd "$repo_root"
}

cd homelab-backstage

yarn install --immutable
yarn tsc
yarn build:backend

docker image build . -f packages/backend/Dockerfile --tag backstage

cleanup()