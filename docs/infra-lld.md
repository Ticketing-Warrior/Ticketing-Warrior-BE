## ***VPC 및 IGW 생성***

1. AWS Management Console의 Services 메뉴에서 **VPC**를 클릭합니다.
2. 왼쪽 탐색 창에서 **Your VPCs**를 클릭합니다.
3. **Create VPC**를 클릭하고 다음을 구성합니다.
    - **Resources to create : VPC only**
    - **Name tag- optional: *TW-VPC***
    - **IPV4 CIDR(IPv4 CIDR manual input): *10.10.0.0/16***
    - **Create VPC**를 클릭하여 VPC를 생성합니다.

## ***인터넷 게이트웨이 생성***

1. 왼쪽 탐색 창에서 **Internet Gateways**를 클릭합니다.
2. **Create internet gateway**를 클릭하고 다음을 구성합니다.
    - **Name tag**: ***TW-IGW***
3. **Create internet gateway**를 클릭합니다.
4. **[Actions]**을 클릭하고, **Attach to VPC** 를 선택합니다.
5. **VPC**에서 TW-**VPC** 를 선택하고, **Attach intemet gateway**를 선택합니다.

## ***Subnet - Public, Private, Private DB 용도로 6개 생성***

1. 왼쪽 탐색 창에서 **Subnets**를 클릭합니다.
2. **Create subnet**을 클릭하고 다음 2개의 Public Subnet을 차례대로 구성합니다.
    - VPC ID : ***TW-VPC***
    - Subnet name: ***Public Subnet1, Public Subnet2***
    - Availability Zone: ap-northeast-2a, ap-northeast-2b
    - IPv4 CIDR block: `10.10.10.0/24` , `10.10.11.0/24`
3. 다시 왼쪽 탐색 창에서 **Subnets**를 클릭합니다.
4. **Create subnet**을 클릭하고 다음 2개의 Private Subnet을 차례대로 구성합니다.
    - VPC ID : ***TW-VPC***
    - Subnet name: ***Private Subnet1, Private Subnet2***
    - Availability Zone: ap-northeast-2a, ap-northeast-2b
    - IPv4 CIDR block: `10.10.20.0/24` , `10.10.21.0/24`
5. 다시 왼쪽 탐색 창에서 **Subnets**를 클릭합니다.
6. **Create subnet**을 클릭하고 다음 2개의 PrivateDB Subnet을 차례대로 구성합니다.
    - VPC ID : ***TW-VPC***
    - Subnet name: ***PrivateDB Subnet1, PrivateDB Subnet2***
    - Availability Zone: ap-northeast-2a, ap-northeast-2b
    - IPv4 CIDR block: `10.10.30.0/24` , `10.10.31.0/24`

## ***NAT Gateway 생성***

Private Subnet에 있는 ECS Fargate가 외부 인터넷으로 아웃바운드 통신(예: ECR 이미지 다운로드, 패치)을 할 수 있도록 NAT Gateway를 설정합니다.

1. VPC 좌측 목록에서 Elastic IPs를 클릭하고 Allocate Elastic IP address 클릭하여 EIP 할당받기
2. 왼쪽 탐색창에서 NAT gateways를 클릭합니다.
3. **Create NAT gateway**를 클릭하고 아래와 같이 구성합니다.
    - Name-optional: ***TW-NAT-GW***
    - VPC: ***TW-VPC***
    - Method of Elastic IP (EIP) allocation: ***Manual***
    - Public Subnet1에 해당하는 AZ에 할당받은 EIP 선택
    - create NAT gateway

## ***라우팅 테이블(RT) 구성***

1. 왼쪽 탐색 창에서 **Route Tables**를 클릭합니다.
2. **Create route table**을 클릭하고 다음과 같이 Public RT를 구성합니다.
    - **Name *- optional:*** ***TW-Public-RT***
    - **VPC : *TW-VPC***
    - [**Create route table**]
3. Edit route를 클릭하고, **Add route**를 클릭하여 다음을 구성합니다.
    - **Destination: *0.0.0.0/0***
    - **Target: *TW-IGW*** 를 선택합니다.
4. **Save changes**를 클릭합니다.
5. **Subnet Associations** 탭을 클릭하여, **Edit subnet associations**를 클릭합니다.
6. **Public Subnet1, Public Subnet2**이 있는 행을 선택하고, **Save associations**를 클릭합니다.
7. **Create route table**을 클릭하고 다음과 같이 Private RT( ECS용)를 구성합니다.
    - **Name *- optional:*** ***TW-Private-RT***
    - **VPC : *TW-VPC*** 선택
    - [**Create route table**]
8. Edit route를 클릭하고, **Add route**를 클릭하여 다음을 구성합니다.
    - **Destination: *0.0.0.0/0***
    - **Target: *TW-NAT-GW***
    - **Save changes**를 클릭합니다.
9. 생성된 ‘**TW-Private-RT**’의 **Subnet Associations** 탭을 클릭하여, Explicit subnet associations에 **Edit subnet associations**를 클릭합니다.
10. **Private Subnet1, Private Subnet2가** 있는 행을 선택하고, **Save associations**를 클릭합니다.
11. **Create route table**을 클릭하고 다음과 같이 PrivateDB RT(RDS/Cache용)를 구성합니다.
    - **Name *- optional:*** ***TW-PrivateDB-RT***
    - **VPC : *TW-VPC*** 선택
    - [**Create route table**]
12. 생성된 ‘**TW-PrivateDB-RT**’의 **Subnet Associations** 탭을 클릭하여, Explicit subnet associations에 **Edit subnet associations**를 클릭합니다.
13. **PrivateDB Subnet1, PrivateDB Subnet2가** 있는 행을 선택하고, **Save associations**를 클릭합니다.

### 보안 그룹

### ALB
이름: TW-SG-ALB

Inbound: 0.0.0.0/0
Protocol: TCP
Port range: 80
Type: HTTP

---

Inbound: 0.0.0.0/0
Protocol: TCP
Port range: 443
Type: HTTPS

---

Outbound: SG_ECS
Protocol: TCP
Port range: 8080

---

### ECS (Fargate)
이름: TW-SG-ECS

Inbound: SG_ALB
Protocol: TCP
Port range: 8080

---

Outbound: SG_Aurora
Protocol: TCP
Port range: 3306

---

Outbound: SG_Cache
Protocol: TCP
Port range: 6379

---

### Aurora
이름: TW-SG-Aurora

Inbound: SG_ECS
Protocol: TCP
Port range: 3306

---

Outbound: 기본값

---

### Cache
이름: TW-SG-Cache

Inbound: SG_ECS
Protocol: TCP
Port range: 6379

---

Outbound: 기본값