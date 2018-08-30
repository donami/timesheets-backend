pipeline {
    environment {
        registry = "donami/react-app"
        registryCredential = 'dockerhub'
        dockerImage = ''
    }
    agent {
        docker {
            image 'node:6-alpine' 
            args '-p 3000:3000' 
        }
    }
    stages {
        stage('Build') {
            steps {
                sh 'npm install'
                sh 'npm run build'
            }
        }

        stage('Building image') {
          steps{
            script {
              dockerImage = docker.build registry + ':$BUILD_NUMBER'
            }
          }
        }

        stage('Deploy Image') {
          steps {
            script {
              docker.withRegistry('', registryCredential ) {
                dockerImage.push()
              }
            }
          }
        }

        // stage('Deploy'){
        //   steps {
        //     sh 'docker build -t react-app --no-cache .'
        //     sh 'docker tag react-app donami/react-app'
        //     sh 'docker push donami/react-app'
        //     sh 'docker rmi -f react-app donami/react-app'
        //   }
        // }

        // stage('Serve') {
        //     steps {
        //         sh 'npm run serve'
        //     }
        // }
    }
}