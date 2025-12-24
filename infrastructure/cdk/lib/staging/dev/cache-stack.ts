import * as cdk from 'aws-cdk-lib';
import * as elasticache from 'aws-cdk-lib/aws-elasticache';
import * as ec2 from 'aws-cdk-lib/aws-ec2';
import { Construct } from 'constructs';

interface CacheStackProps extends cdk.StackProps {
  environment: string;
}

export class CacheStack extends cdk.Stack {
  public readonly cacheCluster: elasticache.CfnCacheCluster;

  constructor(scope: Construct, id: string, props: CacheStackProps) {
    super(scope, id, props);

    // VPC for ElastiCache
    const vpc = new ec2.Vpc(this, 'CacheVpc', {
      maxAzs: 2,
      natGateways: props.environment === 'prod' ? 2 : 1,
    });

    // Security Group
    const securityGroup = new ec2.SecurityGroup(this, 'CacheSecurityGroup', {
      vpc,
      description: 'Security group for ElastiCache Valkey',
      allowAllOutbound: true,
    });

    securityGroup.addIngressRule(
      ec2.Peer.ipv4(vpc.vpcCidrBlock),
      ec2.Port.tcp(6379),
      'Allow Redis port from VPC'
    );

    // Subnet Group
    const subnetGroup = new elasticache.CfnSubnetGroup(this, 'CacheSubnetGroup', {
      description: 'Subnet group for ElastiCache',
      subnetIds: vpc.privateSubnets.map(subnet => subnet.subnetId),
    });

    // ElastiCache for Valkey (Redis-compatible)
    this.cacheCluster = new elasticache.CfnCacheCluster(this, 'CacheCluster', {
      cacheNodeType: props.environment === 'prod' ? 'cache.t3.medium' : 'cache.t3.micro',
      engine: 'redis',
      numCacheNodes: 1,
      vpcSecurityGroupIds: [securityGroup.securityGroupId],
      cacheSubnetGroupName: subnetGroup.ref,
    });

    // Outputs
    new cdk.CfnOutput(this, 'CacheEndpoint', {
      value: this.cacheCluster.attrRedisEndpointAddress,
      exportName: `${props.environment}-CacheEndpoint`,
    });
  }
}
